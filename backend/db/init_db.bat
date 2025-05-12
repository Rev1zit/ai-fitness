@echo off
set PGPASSWORD=postgres
psql -U postgres -h localhost -d postgres -f schema.sql
pause 