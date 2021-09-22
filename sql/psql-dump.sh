pg_dump -U postgres mydb > dbexport.pgsql

psql -U username dbname < dbexport.pgsql


psql -h ec2-54-211-160-34.compute-1.amazonaws.com  -U zvjmbyktodziqt d8u6orqlopl8vc < backup-after-step10.pgsql


4b8c4733f192f1144f1acb447cff6e1b332fce9c91017628d6fcbcd716261455

pg_dump -h ec2-54-211-160-34.compute-1.amazonaws.com  -U zvjmbyktodziqt d8u6orqlopl8vc > backup-after-step10.pgsql 

