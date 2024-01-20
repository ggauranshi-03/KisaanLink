const { Contract } = require('fabric-contract-api');

class ZoneSupervisorContract extends Contract {

    // Receive real-time information from field inspectors and vendors/farmers
    async receiveInformation(ctx, infoId, infoDetails) {
        await ctx.stub.putState(infoId, Buffer.from(JSON.stringify(infoDetails)));
    }

    // Manage field visits
    async manageFieldVisit(ctx, visitId, visitDetails) {
        const visit = {
            ...visitDetails,
            approved: false // default to not approved
        };
        await ctx.stub.putState(visitId, Buffer.from(JSON.stringify(visit)));
    }

    // Approve field visit actions
    async approveFieldVisit(ctx, visitId) {
        const visitAsBytes = await ctx.stub.getState(visitId);
        if (!visitAsBytes || visitAsBytes.length === 0) {
            throw new Error(`Visit with ID ${visitId} does not exist`);
        }
        const visit = JSON.parse(visitAsBytes.toString());
        visit.approved = true;
        await ctx.stub.putState(visitId, Buffer.from(JSON.stringify(visit)));
    }

    // Store action for accountability
    async storeAction(ctx, actionId, actionDetails) {
        await ctx.stub.putState(actionId, Buffer.from(JSON.stringify(actionDetails)));
    }

    // Access transporter information
    async getTransporterInfo(ctx, transporterId) {
        const transporterAsBytes = await ctx.stub.getState(transporterId);
        if (!transporterAsBytes || transporterAsBytes.length === 0) {
            throw new Error(`Transporter with ID ${transporterId} does not exist`);
        }
        return transporterAsBytes.toString();
    }

    // Add transporter information (if needed)
    async addTransporterInfo(ctx, transporterId, transporterDetails) {
        await ctx.stub.putState(transporterId, Buffer.from(JSON.stringify(transporterDetails)));
    }
}

module.exports = ZoneSupervisorContract;

