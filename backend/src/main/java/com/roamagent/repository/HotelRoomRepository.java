package com.roamagent.repository;

import com.roamagent.entity.HotelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HotelRoomRepository extends JpaRepository<HotelRoom, String> {

    @Query("SELECT r FROM HotelRoom r WHERE " +
           "(LOWER(r.hotelProperty.city) = LOWER(:city) OR LOWER(r.hotelProperty.locality) = LOWER(:city)) " +
           "AND (:maxPrice IS NULL OR r.pricePerNight <= :maxPrice) " +
           "AND (:minRating IS NULL OR r.hotelProperty.userRating >= :minRating) " +
           "ORDER BY r.hotelProperty.userRating DESC, r.pricePerNight ASC")
    List<HotelRoom> searchHotels(
            @Param("city") String city,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating
    );
}