package com.example.comicflow.subscription.mapper;

import com.example.comicflow.subscription.dto.response.CreateSubscription;
import com.example.comicflow.subscription.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    @Mapping(target = "planName", source = "plan.name")
    CreateSubscription toCreateSubscription(Subscription subscription);
}
