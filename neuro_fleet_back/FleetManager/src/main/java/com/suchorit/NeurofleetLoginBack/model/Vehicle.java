package com.suchorit.NeurofleetLoginBack.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {
    @Id
    protected String regNo;
    protected String email;
    protected String name;
    protected String location;
    protected double fuel;
    protected String status;
    protected String type;
    protected double distanceCovered;
    protected double engineTemp;
    protected double tireWear;
    protected  double batteryHealth;
    protected double fuelEfficiency;
    private String licenseNo;

    public double getEngineTemp() {
        return engineTemp;
    }

    public void setEngineTemp(double engineTemp) {
        this.engineTemp = engineTemp;
    }

    public double getTireWear() {
        return tireWear;
    }

    public void setTireWear(double tireWear) {
        this.tireWear = tireWear;
    }

    public double getBatteryHealth() {
        return batteryHealth;
    }

    public void setBatteryHealth(double batteryHealth) {
        this.batteryHealth = batteryHealth;
    }

    public double getDistanceCovered() {
        return distanceCovered;
    }

    public void setDistanceCovered(double distanceCovered) {
        this.distanceCovered = distanceCovered;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

//    public Double getLatitude() {
//        return latitude;
//    }
//
//    public void setLatitude(Double latitude) {
//        this.latitude = latitude;
//    }

//    public Double getLongitude() {
//        return longitude;
//    }
//
//    public void setLongitude(Double longitude) {
//        this.longitude = longitude;
//    }

    public double getFuel() {
        return fuel;
    }

    public void setFuel(double fuel) {
        this.fuel = fuel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
