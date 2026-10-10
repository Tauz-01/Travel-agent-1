# RoamAgent Routing Engine, Transfer Math & Disruption/Recovery Algorithm

## 1. Graph Network Representation

The travel network is modelled as a directed graph $G = (V, E)$:
- **Vertices ($V$)**: Transport stops/terminals $v \in V$ (e.g. Visakhapatnam Dwaraka BS, Vijayawada PNBS, Hyderabad MGBS).
- **Edges ($E$)**: Scheduled bus segments $e = (u, v, t_{dep}, t_{arr}, \text{fare}, \text{vehicleAttrs}) \in E$.
- **Transfer Connections**: Interchange points where $v_{arr} = v_{dep}$ or physical distance allows walking/transfer within $T_{walk}$.

---

## 2. Deterministic Multi-Leg Route Search Algorithm

The multi-leg route search executes a **Time-Expanded Bounded Depth First Search (DFS) / Modified Dijkstra** algorithm:

1. **Input**: Origin Stop $S_{org}$, Destination Stop $S_{dst}$, Travel Date $D$, Max Budget $B_{max}$, Arrival Deadline $T_{deadline}$, Minimum Transfer Buffer $T_{buf\_min}$ (default 45 mins), Max Transfers $K_{max} = 2$.
2. **Hard-Constraint Validation Filter**:
   - **Segment Continuity**: Departure time of Leg $k+1$ must be after arrival time of Leg $k$.
   - **Transfer Buffer Calculation**:
     $$\text{Effective Buffer} = T_{dep}(k+1) - T_{arr}(k) - T_{interchange\_walk}$$
     $$\text{Feasible connection if and only if: } \text{Effective Buffer} \ge T_{buf\_min}$$
   - **Arrival Deadline Constraint**:
     $$T_{arr}(\text{Final Leg}) \le T_{deadline}$$
   - **Budget Cap Constraint**:
     $$\sum_{i=1}^{m} \text{Fare}(\text{Leg } i) \le B_{max}$$
3. **Outcome**:
   - Returns all paths meeting $100\%$ of hard constraints.
   - If fewer than 4 paths meet constraints, returns exact number found with explicit explanations for rejected paths (e.g., "3 alternative paths exceeded budget cap of ₹1500").
   - **Never** silently relaxes $B_{max}$, $T_{deadline}$, or $T_{buf\_min}$.

---

## 3. Two-Stage Recommendation Ranking Pipeline

### Stage 1: Hard-Constraint Filtering
Excludes all infeasible journeys.

### Stage 2: Configurable Weighted Composite Scoring
For each remaining feasible candidate journey $J$, compute Composite Score $S(J) \in [0, 100]$:

$$S(J) = w_f \cdot S_{\text{fare}}(J) + w_t \cdot S_{\text{time}}(J) + w_b \cdot S_{\text{buffer}}(J) + w_r \cdot S_{\text{rating}}(J) + w_v \cdot S_{\text{age}}(J)$$

#### Normalized Factor Sub-Scores ($S_i \in [0, 100]$)
- **Fare Score ($S_{\text{fare}}$)**: $100 \times \left(1 - \frac{\text{Total Fare} - \text{Min Fare}}{\text{Max Fare} - \text{Min Fare} + \epsilon}\right)$
- **Duration Score ($S_{\text{time}}$)**: $100 \times \left(1 - \frac{\text{Total Duration} - \text{Min Duration}}{\text{Max Duration} - \text{Min Duration} + \epsilon}\right)$
- **Buffer Safety Score ($S_{\text{buffer}}$)**: Optimal buffer is $60\text{--}90$ mins. Buffers $<45$ mins score $0$.
- **Operator Rating Score ($S_{\text{rating}}$)**: $20 \times \text{Operator Rating (1-5)}$.
- **Vehicle Age Score ($S_{\text{age}}$)**: $100 - (\text{Current Year} - \text{Manufacture Year}) \times 10$.

#### Default Weights
- $w_f = 0.30$ (Fare)
- $w_t = 0.25$ (Travel Time)
- $w_b = 0.20$ (Transfer Buffer Risk)
- $w_r = 0.15$ (Operator Rating)
- $w_v = 0.10$ (Vehicle Modernity)

---

## 4. Deterministic Disruption & Mid-Trip Recovery Algorithm

### 4.1 Required Disruption Test Math Case
- **Original Schedule**:
  - Leg 1 Arrival at Vijayawada: `02:40 AM`
  - Leg 2 Departure from Vijayawada: `03:35 AM`
  - Required Min Transfer Buffer: `45 minutes`
  - Original Buffer = $03:35 - 02:40 = \mathbf{55\text{ minutes}}$ (FEASIBLE)
- **Injected Disruption Event**:
  - Leg 1 Delay = `50 minutes`
  - Recalculated Projected Arrival = $02:40 + 50\text{ mins} = \mathbf{03:30\text{ AM}}$
  - Recalculated Remaining Buffer = $03:35 - 03:30 = \mathbf{5\text{ minutes}}$
- **Conflict Assessment**:
  $$5\text{ minutes} < 45\text{ minutes Required Buffer} \implies \mathbf{TRANSFER\ FEASIBILITY\ BREACHED}$$

### 4.2 Recovery Search Workflow
1. **Scope Boundary**: Recovery search begins from the **intermediate transfer stop** (Vijayawada PNBS) at the projected arrival time (`03:30 AM`), preserving completed Leg 1 history.
2. **Mid-Trip Graph Search**: Search for departing connections from Vijayawada to Hyderabad departing $t \ge 03:30\text{ AM} + 45\text{ mins} = 04:15\text{ AM}$.
3. **Found Alternatives**:
   - **Recovery Option A**: Departs Vijayawada `04:30 AM` -> Arrives Hyderabad `09:15 AM` (Buffer = 60 mins, Fare Delta = ₹0).
   - **Recovery Option B**: Departs Vijayawada `05:00 AM` -> Arrives Hyderabad `09:45 AM` (Buffer = 90 mins, Fare Delta = +₹100).
4. **Comparison Payload**: Output structured side-by-side DTO comparing Active vs Recovery Option A & B (New ETA, Fare Delta, Reason).

### 4.3 Atomic Revision & Approval Rules
- Recovery proposal is saved as `PROPOSED`. Active itinerary remains **unchanged**.
- Upon `POST /api/v1/itineraries/{id}/revisions/approve`:
  1. Open database `@Transactional` boundary.
  2. Acquire pessimistic lock on `itineraries` record.
  3. Verify proposal status is `PROPOSED` and proposal timestamp $< 15$ mins old.
  4. Archive current active legs to `ITINERARY_REVISION_HISTORY`.
  5. Overwrite active legs with recovery legs.
  6. Increment `current_revision_number`.
  7. Write `AUDIT_RECORD` entry.
  8. Transaction commit -> Resume journey monitoring.
- If user clicks `REJECT`, proposal status set to `REJECTED`, active itinerary maintained.
