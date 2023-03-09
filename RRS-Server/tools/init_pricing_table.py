#!/usr/bin/env python3
import sys
import time

code = "dev.rrsmedical.com" if len(sys.argv) < 2 else sys.argv[1]
baseChargeFile = "base_charge.json" if len(sys.argv) < 3 else sys.argv[2]
deliveryChargeFile = "delivery_charge.json" if len(sys.argv) < 4 else sys.argv[3]

baseCharge = {"D":{"R":{"F":0,"S":0},"F":{"F":0,"S":0},"B":{"F":0,"S":0},"RF":{"F":0,"S":0},"RFB":{"F":0,"S":0},"D":{"F":25,"S":25}},"P":{"R":{"F":6.5,"S":6.5},"F":{"F":15,"S":15},"B":{"F":6.5,"S":6.5},"RF":{"F":15,"S":15},"RFB":{"F":15,"S":15},"D":{"F":25,"S":25}},"T":{"R":{"F":6.5,"S":6.5},"F":{"F":15,"S":15},"B":{"F":6.5,"S":6.5},"RF":{"F":15,"S":15},"RFB":{"F":15,"S":15},"D":{"F":25,"S":25}}}
deliveryCharge = {"D":{"E":{"R":{"F":0,"S":0},"B":{"F":0,"S":0},"D":{"F":15,"S":0}},"F":{"R":{"F":0,"S":0},"B":{"F":0,"S":0},"D":{"F":12.5,"S":2.5}},"M":{"R":{"F":7.05,"S":7.05},"F":{"F":7.05,"S":7.05},"B":{"F":7.05,"S":7.05},"RF":{"F":7.05,"S":7.05},"RFB":{"F":7.05,"S":7.05},"D":{"F":30,"S":5.5}}},"P":{"E":{"R":{"F":4,"S":0},"B":{"F":4,"S":0},"D":{"F":15,"S":0}},"F":{"R":{"F":6,"S":1},"B":{"F":6,"S":1},"D":{"F":12.5,"S":2.5}},"M":{"R":{"F":30,"S":7},"F":{"F":15,"S":0},"B":{"F":30,"S":7},"RF":{"F":15,"S":0},"RFB":{"F":15,"S":0},"D":{"F":30,"S":5.5}}},"T":{"E":{"R":{"F":4,"S":0},"B":{"F":4,"S":0},"D":{"F":15,"S":0}},"F":{"R":{"F":6,"S":1},"B":{"F":6,"S":1},"D":{"F":12.5,"S":2.5}},"M":{"R":{"F":30,"S":7},"F":{"F":15,"S":0},"B":{"F":30,"S":7},"RF":{"F":15,"S":0},"RFB":{"F":15,"S":0},"D":{"F":30,"S":5.5}}}}

print("-- Generated at %s" % time.asctime())
print("delete from portal_pricing where code = '%s';" % code)
for sendTo in deliveryCharge:
	for deliveryMethod in deliveryCharge[sendTo]:
		for infoRequested in deliveryCharge[sendTo][deliveryMethod]:
			for deliveryTimeframe in deliveryCharge[sendTo][deliveryMethod][infoRequested]:
				baseChargeCents = int(100 * baseCharge[sendTo][infoRequested][deliveryTimeframe])
				deliveryChargeCents = int(100 * deliveryCharge[sendTo][deliveryMethod][infoRequested][deliveryTimeframe])
				print("insert into portal_pricing(code, send_to, info_requested, delivery_method, delivery_timeframe, base_charge_cents, delivery_charge_cents) values ('%s', '%s', '%s', '%s', '%s', %d, %d);" % (code, sendTo, infoRequested, deliveryMethod, deliveryTimeframe, baseChargeCents, deliveryChargeCents))