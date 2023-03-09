import { PricingTable } from "./PricingTable";

/*
const deliveryCharge = {
	//Doctor
	D: {
		//Elec
		E: {
			//Records
			R: {
				// 1-2 day
				F: 0,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 0,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			}
		},
		//Fax
		F: {
			//Records
			R: {
				// 1-2 day
				F: 0,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 0,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 12.50,
				// 3-5 days
				S: 2.50,
			}
		},
		//Mail
		M: {
			//Records
			R: {
				// 1-2 day
				F: 7.05,
				// 3-5 days
				S: 7.05,
			},
			//Images(Films)
			F: {
				// 1-2 day
				F: 7.05,
				// 3-5 days
				S: 7.05,
			},
			//Bills
			B: {
				// 1-2 day
				F: 7.05,
				// 3-5 days
				S: 7.05,
			},
			//Records and Films
			RF: {
				// 1-2 day
				F: 7.05,
				// 3-5 days
				S: 7.05,
			},
			//Records, Films, and Bills
			RFB: {
				// 1-2 day
				F: 7.05,
				// 3-5 days
				S: 7.05,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 5.50,
			}
		}
	},
	//Me
	P: {
		//Elec
		E: {
			//Records
			R: {
				// 1-2 day
				F: 4,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 4,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			}
		},
		//Fax
		F: {
			//Records
			R: {
				// 1-2 day
				F: 6,
				// 3-5 days
				S: 1,
			},
			//Bills
			B: {
				// 1-2 day
				F: 6,
				// 3-5 days
				S: 1,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 12.50,
				// 3-5 days
				S: 2.50,
			}
		},
		//Mail
		M: {
			//Records
			R: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 7,
			},
			//Images(Films)
			F: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 7,
			},
			//Records and Films
			RF: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Records, Films, and Bills
			RFB: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 5.50,
			}
		}
	},
	//Third party
	T: {
		//Elec
		E: {
			//Records
			R: {
				// 1-2 day
				F: 4,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 4,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			}
		},
		//Fax
		F: {
			//Records
			R: {
				// 1-2 day
				F: 6,
				// 3-5 days
				S: 1,
			},
			//Bills
			B: {
				// 1-2 day
				F: 6,
				// 3-5 days
				S: 1,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 12.50,
				// 3-5 days
				S: 2.50,
			}
		},
		//Mail
		M: {
			//Records
			R: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 7,
			},
			//Images(Films)
			F: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Bills
			B: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 7,
			},
			//Records and Films
			RF: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Records, Films, and Bills
			RFB: {
				// 1-2 day
				F: 15,
				// 3-5 days
				S: 0,
			},
			//Disability Forms
			D: {
				// 1-2 day
				F: 30,
				// 3-5 days
				S: 5.50,
			}
		}
	}
};

const baseCharge = {
	//Doctor
	D: {
		//Records
		R: {
			// 1-2 day
			F: 0,
			// 3-5 days
			S: 0,
		},
		//Images(Films)
		F: {
			// 1-2 day
			F: 0,
			// 3-5 days
			S: 0,
		},
		//Bills
		B: {
			// 1-2 day
			F: 0,
			// 3-5 days
			S: 0,
		},
		//Records and Films
		RF: {
			// 1-2 day
			F: 0,
			// 3-5 days
			S: 0,
		},
		//Records, Films, and Bills
		RFB: {
			// 1-2 day
			F: 0,
			// 3-5 days
			S: 0,
		},
		//Disability Forms
		D: {
			// 1-2 day
			F: 25,
			// 3-5 days
			S: 25,
		}
	},
	//Patient
	P: {
		//Records
		R: {
			// 1-2 day
			F: 6.50,
			// 3-5 days
			S: 6.50,
		},
		//Images(Films)
		F: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Bills
		B: {
			// 1-2 day
			F: 6.50,
			// 3-5 days
			S: 6.50,
		},
		//Records and Films
		RF: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Records, Films, and Bills
		RFB: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Disability Forms
		D: {
			// 1-2 day
			F: 25,
			// 3-5 days
			S: 25,
		}
	},
	//Third party
	T: {
		//Records
		R: {
			// 1-2 day
			F: 6.50,
			// 3-5 days
			S: 6.50,
		},
		//Images(Films)
		F: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Bills
		B: {
			// 1-2 day
			F: 6.50,
			// 3-5 days
			S: 6.50,
		},
		//Records and Films
		RF: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Records, Films, and Bills
		RFB: {
			// 1-2 day
			F: 15,
			// 3-5 days
			S: 15,
		},
		//Disability Forms
		D: {
			// 1-2 day
			F: 25,
			// 3-5 days
			S: 25,
		}
	}
};
*/

/*
export function getBaseCharge(sendTo, infoRequested, timeFrame) {
	return (
		baseCharge &&
		baseCharge[sendTo] &&
		baseCharge[sendTo][infoRequested] &&
		baseCharge[sendTo][infoRequested][timeFrame]
	);
}
*/

/*
export function getDeliveryCharge(sendTo, deliveryMethod, infoRequested, timeFrame) {
	return (
		deliveryCharge &&
		deliveryCharge[sendTo] &&
		deliveryCharge[sendTo][deliveryMethod] &&
		deliveryCharge[sendTo][deliveryMethod][infoRequested] &&
		deliveryCharge[sendTo][deliveryMethod][infoRequested][timeFrame]
	);
}
*/

/*
export function calculateTotalCost(values) {
	const sendTo = values.records.recipient;
	const infoRequested = values.records.infoRequested;
	const deliveryMethod = values.records.deliveryMethod;
	const deliveryTimeframe = values.records.timeframe;
	console.trace(`calculateTotalCost(sendTo: ${sendTo}, infoRequested: ${infoRequested}, ${deliveryMethod}, ${deliveryTimeframe})`);
	return PricingTable.get().getTotalCost(sendTo, infoRequested, deliveryMethod, deliveryTimeframe);
}
*/