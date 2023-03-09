import axios from "axios";
import { info } from "console";

export class PricingTable {
	constructor(private entries: PricingRecord[]) { }

	static instance: PricingTable | null;

	public static get(): PricingTable {
		if (PricingTable.instance == null) {
			PricingTable.fetch();
			console.log("Pricing records: ");
			console.log(PricingTable.instance);
		}
		return PricingTable.instance as PricingTable;
	}

	private static async fetch() {
		try {
			await axios.get<PricingRecord[]>("/api/portal/pricing")
				.then((value) => PricingTable.instance = new PricingTable(value.data));
		}
		catch (e) {
			const err: Error = e;
			console.trace("Error retrieving pricing table from server...");
			alert("Unable to retrieve pricing data from server. Please refresh your browser and try again.");
			throw err;
		}
	}

	public getTotalCost(sendTo: SendTo, infoRequested: InfoRequested, deliveryMethod: DeliveryMethod, deliveryTimeframe: DeliveryTimeframe): number {
		let baseCharge = this.getBaseCharge(sendTo, infoRequested, deliveryTimeframe);
		let deliveryCharge = this.getDeliveryCharge(sendTo, infoRequested, deliveryMethod, deliveryTimeframe);
		return baseCharge + deliveryCharge;
	}

	public getBaseCharge(sendTo: SendTo, infoRequested: InfoRequested, deliveryTimeframe: DeliveryTimeframe): number {
		let entry = this.entries.find(
			(entry: PricingRecord) =>
				(sendTo == entry.sendTo) &&
				(infoRequested == entry.infoRequested) &&
				(deliveryTimeframe == entry.deliveryTimeframe)
		);
		return entry ? ((entry.baseChargeCents | 0) / 100) : NaN;
	}

	public getDeliveryCharge(sendTo: SendTo, infoRequested: InfoRequested, deliveryMethod: DeliveryMethod, deliveryTimeframe: DeliveryTimeframe): number {
		let entry = this.entries.find(
			(entry: PricingRecord) =>
				(sendTo == entry.sendTo) &&
				(infoRequested == entry.infoRequested) &&
				(deliveryMethod == entry.deliveryMethod) &&
				(deliveryTimeframe == entry.deliveryTimeframe)
		);
		return entry ? ((entry.deliveryChargeCents | 0) / 100) : NaN;
	}
}

const PricingRecordType = null as unknown as PricingRecord;

export type SendTo = typeof PricingRecordType.sendTo;
export type InfoRequested = typeof PricingRecordType.infoRequested;
export type DeliveryMethod = typeof PricingRecordType.deliveryMethod;
export type DeliveryTimeframe = typeof PricingRecordType.deliveryTimeframe;

export interface PricingRecord {
	code: string;
	sendTo: "D" | "P" | "T";
	infoRequested: "R" | "F" | "B" | "RF" | "RFB" | "D";
	deliveryMethod: "E" | "F" | "M";
	deliveryTimeframe: "F" | "S";
	baseChargeCents: number;
	deliveryChargeCents: number;
}