package com.example.comicflow.payment.repository;

import com.example.comicflow.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query("SELECT p FROM Payment p " +
            "LEFT JOIN FETCH p.user " +
            "LEFT JOIN FETCH p.chapter " +
            "WHERE p.orderId = :orderId"
    )
    Optional<Payment> findByOrderIdWithJoin(@Param("orderId") String orderId);

    Optional<Payment> findByOrderId(String orderId);
}
