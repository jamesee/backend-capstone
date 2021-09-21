pg_dump -U postgres mydb > dbexport.pgsql

psql -U username dbname < dbexport.pgsql