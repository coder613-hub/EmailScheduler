import sys
import logging
import pymysql
import json

# rds settings
rds_host  = "database-1.czqltbydhoi5.us-east-1.rds.amazonaws.com"
user_name = "admin"
password = "Practicum123"
db_name = "thisismyschemaforemails"

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create the database connection outside of the handler to allow connections to be
# re-used by subsequent function invocations.
try:
    conn = pymysql.connect(host=rds_host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")

def lambda_handler(event, context):
    """
    This function writes records to an RDS MySQL Database
    """
    Sender= event['Sender']
    Recipient = event['Recipient']
    Subject = event['Subject']
    Body = event['Body']
    TimeOfDay = event['TimeOfDay']
    Recurring = event['Recurring']
    NumberDay = event['NumberDay']

    sql_string = "INSERT INTO EmailDetails (Sender, Recipient, Subject, Body, TimeOfDay, Recurring, NumberDay) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    logger.error(sql_string)

    with conn.cursor() as cur:
        cur.execute(sql_string, (Sender, Recipient, Subject, Body, TimeOfDay, Recurring, NumberDay))
        conn.commit()

    return {
        'statusCode': 200,
        'body': json.dumps('Successfully scheduled email')
    }
