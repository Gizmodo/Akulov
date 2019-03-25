# Import modules
import datetime
import ipaddress
import threading
import logging
from pymongo import MongoClient
from multiping import MultiPing
from pysnmp.hlapi import *

HOST = "127.0.0.1"
DB_NAME = 'DevicesNoHistory'
LEXMARKTAG = "Lexmark"

TIMEOUT_SNMP = 1.0
RETRIES_SNMP = 0

TIMEOUT_PING = 0.5

TIMER_INTERVAL = 60 * 60 * 8  # Every 8 hours
TIMER_INTERVAL_TEST = 30  # Every 10 seconds

pagesPrinted = "1.3.6.1.2.1.43.10.2.1.4.1.1"
tonerLevel = "1.3.6.1.2.1.43.11.1.1.9.1.1"
printerModel = "1.3.6.1.2.1.25.3.2.1.3.1"
printerLocation = "1.3.6.1.2.1.1.6.0"
printerSN = "1.3.6.1.2.1.43.5.1.1.17.1"

printerName = "1.3.6.1.2.1.1.5.0"

# Lexmark OIDs
currentSupplySerialNumber = "1.3.6.1.4.1.641.6.4.4.1.1.6"
supplyHistorySerialNumber = "1.3.6.1.4.1.641.6.4.4.2.1.6"

client = MongoClient(HOST, 27017)
db = client[DB_NAME]
collection_printers = db.printers
collection_pages = db.pages

printer = {}

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s-%(message)s', datefmt='%d.%m %H:%M:%S')

def get_snmp(ip, oid):
    global zx
    rez = None
    try:
        errorIndication, errorStatus, errorIndex, varBinds = next(
            getCmd(SnmpEngine(),
                   CommunityData('public'),
                   UdpTransportTarget(
                       (ip, 161), timeout=TIMEOUT_SNMP, retries=RETRIES_SNMP
                   ),
                   ContextData(),
                   ObjectType(ObjectIdentity(oid)))
        )

        if errorIndication:
            logging.info(errorIndication)
            return rez
        elif errorStatus:
            logging.info('%s at %s' % (errorStatus.prettyPrint(),
                                       errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
            return rez
        else:
            for varBind in varBinds:
                if rez is None:
                    zx = str(varBind).split("=")
                rez = zx[1].strip()
    except:
        rez = None
    return rez


#################################################################################################

def mainCycle():
    try:
        threading.Timer(TIMER_INTERVAL, mainCycle).start()  # called every minute
        global model

        statistic_total_online = 0
        statistic_total_printers = 0
        statistic_total_others = 0
        statistic_start_time = datetime.datetime.utcnow()

        my_list = []
        for i in range(0, 190):
            for j in range(0, 255):
                my_list.append("10.159.{0}.{1}".format(i, j))
            mp = MultiPing(my_list, ignore_lookup_errors=True)
            mp.send()
            responses, no_responses = mp.receive(TIMEOUT_PING)
            for addr, rtt in responses.items():
                logging.info("%s ответил через %f сек." % (addr, rtt))
                statistic_total_online += 1
                model = get_snmp(addr, printerModel)
                # Добавить проверку на "No Such Object currently exists at this OID" для полей model и serial.
                if (model is None) or (model == "No Such Object currently exists at this OID"):
                    logging.info("Устройство %s не ответило на запрос модели", addr)
                    statistic_total_others += 1
                else:
                    serial = get_snmp(addr, printerSN)
                    if (serial is None) or (serial == "No Such Object currently exists at this OID"):
                        logging.info("Устройство %s не ответило на запрос серийного номера", addr)
                    else:
                        statistic_total_printers += 1
                        printer = {}
                        name = get_snmp(addr, printerName)
                        pages = get_snmp(addr, pagesPrinted)
                        toner = get_snmp(addr, tonerLevel)
                        location = get_snmp(addr, printerLocation)
                        dt = datetime.datetime.utcnow()

                        # trim right lexmark model name
                        formatModel()

                        printer = {
                            'model': model,
                            'name': name,
                            'serial': serial,
                            "date": dt,
                            'pages': pages,
                            'toner': toner,
                            "ip": addr,
                            "ip_int": int(ipaddress.IPv4Address(addr)),
                            "location": location
                        }
                        pages_object = {
                            'serial': serial,
                            'pages': pages,
                            'date': dt
                        }
                        # Ищем существующую запись
                        record = collection_printers.find_one({"serial": serial})
                        logging.info(
                            "Find by SN:%s", serial)
                        if record is not None:
                            logging.info(
                                "Update...", addr)
                            collection_printers.find_one_and_update(
                                {"serial": serial},
                                {"$set":
                                    {
                                        'model': model,
                                        "date": dt,
                                        'pages': pages,
                                        'toner': toner,
                                        "ip": addr,
                                        "ip_int": int(ipaddress.IPv4Address(addr)),
                                        "location": location
                                    }
                                },
                                upsert=True
                            )
                        else:
                            logging.info(
                                "Create %s %s." % (addr, serial))
                            collection_printers.insert_one(printer)
            my_list.clear()

        diff = datetime.datetime.utcnow() - statistic_start_time

        hours = int(diff.seconds // (60 * 60))
        minutes = int((diff.seconds // 60) % 60)

        logging.info("===========================================================")
        logging.info("Total online: %s", statistic_total_online)
        logging.info(" MFU: %s", statistic_total_printers)
        logging.info(" Others: %s", statistic_total_others)
        logging.info("Start: %s", statistic_start_time)
        logging.info("Finish: %s", datetime.datetime.utcnow())
        logging.info("Duration: %s:%s" % (hours, minites))
        logging.info("===========================================================")
    except:
        print("Unexpected error:", sys.exc_info()[0])


def formatModel():
    global model
    if model.startswith(LEXMARKTAG):
        split = model.split(" ")
        model = split[0] + " " + split[1]
    # "Xerox VersaLink C600 v  1. 17.  0 - Printer"
    if model.startswith("Xerox VersaLink C600"):
        model = "Xerox VersaLink C600"
    if model.startswith("Xerox WorkCentre 5330"):
        model = "Xerox WorkCentre 5330"
    if model.startswith("Xerox Phaser 5550DN"):
        model = "Xerox Phaser 5550DN"
    if model.startswith("Xerox Phaser 3610"):
        model = "Xerox Phaser 3610"
    if model.startswith("Xerox Phaser 6360DN"):
        model = "Xerox Phaser 6360DN"
    if model.startswith("Xerox WorkCentre 6505DN; Net 95.45,ESS 201104251224"):
        model = "Xerox WorkCentre 6505DN"
    if model.startswith("Xerox WorkCentre 5945 v1 Multifunction System"):
        model = "Xerox WorkCentre 5945"
    #                    if model.startswith("No Such"):
    #                     model = "Unknown model"


mainCycle()
