package com.startupconnect.backend.model;

public class PartnerConnection {
    private String partnerId;
    private String partnerName;
    private String message;
    private String senderEmail;
    private String status;

    public PartnerConnection() {}

    public PartnerConnection(String partnerId, String partnerName, String message, String senderEmail, String status) {
        this.partnerId = partnerId;
        this.partnerName = partnerName;
        this.message = message;
        this.senderEmail = senderEmail;
        this.status = status;
    }

    public String getPartnerId() { return partnerId; }
    public void setPartnerId(String partnerId) { this.partnerId = partnerId; }

    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
