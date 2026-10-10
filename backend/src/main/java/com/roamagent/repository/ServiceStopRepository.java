package com.roamagent.repository;

import com.roamagent.entity.ServiceStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceStopRepository extends JpaRepository<ServiceStop, String> {
    List<ServiceStop> findByStopCityIgnoreCase(String city);
    
    @Query("SELECT ss FROM ServiceStop ss WHERE ss.busService.id = :serviceId ORDER BY ss.stopSequence ASC")
    List<ServiceStop> findByBusServiceIdOrdered(@Param("serviceId") String serviceId);
}
