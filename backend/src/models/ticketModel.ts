import mongoose, { Document, Schema } from 'mongoose';

export interface Ticket extends Document {
    user: mongoose.Types.ObjectId;
    subject: string;
    message: string;
    type: 'general' | 'seller_inquiry' | 'report_issue';
    priority: 'low' | 'normal' | 'high';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    sellerId?: mongoose.Types.ObjectId;
    productId?: mongoose.Types.ObjectId;
    replies: Array<{
        sender: mongoose.Types.ObjectId;
        senderModel: 'User' | 'Seller' | 'Admin';
        message: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const ticketSchema = new Schema<Ticket>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['general', 'seller_inquiry', 'report_issue'],
            default: 'general'
        },
        priority: {
            type: String,
            enum: ['low', 'normal', 'high'],
            default: 'normal'
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open'
        },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        replies: [
            {
                sender: { type: Schema.Types.ObjectId, required: true },
                senderModel: { type: String, enum: ['User', 'Seller', 'Admin'], required: true },
                message: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model<Ticket>('Ticket', ticketSchema);
