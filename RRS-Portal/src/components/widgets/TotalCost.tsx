import React from "react";
import { RequestPortalValues } from "../portal/RequestPortal";
import { usePortal } from "../portal/Portal";
import { Box, Typography } from "@material-ui/core";
import { PricingTable, SendTo, InfoRequested, DeliveryMethod, DeliveryTimeframe } from "../../lib/PricingTable";
//import { calculateTotalCost } from "../../lib/calculateTotalCost";

export default function TotalCost() {
	const portal = usePortal<RequestPortalValues>();
	const sendTo = portal.values.records.recipient as SendTo;
	const infoRequested = portal.values.records.infoRequested as InfoRequested;
	const deliveryMethod = portal.values.records.deliveryMethod as DeliveryMethod;
	const deliveryTimeframe = portal.values.records.timeframe as DeliveryTimeframe;
	const totalCost = PricingTable.get().getTotalCost(sendTo, infoRequested, deliveryMethod, deliveryTimeframe);
	return Number.isNaN(totalCost) ? null : (
		<Box mr={2}>
			<Typography variant="subtitle1" color="textPrimary" align="right">
				{"$" + totalCost.toFixed(2)}
			</Typography>
			<Typography variant="body2" color="textSecondary" align="right">
				Total Cost
			</Typography>
		</Box>
	);
}
