import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  batch: { type: String, required: false },
  course: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactInquiry = mongoose.models.ContactInquiry || mongoose.model("ContactInquiry", contactInquirySchema);

export default ContactInquiry;