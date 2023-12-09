\echo 'Delete and recreate chronoplast db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE chronoplast;
CREATE DATABASE chronoplast;
\connect chronoplast

\i chronoplast-schema.sql
\i chronoplast-seed.sql

\echo 'Delete and recreate chronoplast_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE chronoplast_test;
CREATE DATABASE chronoplast_test;
\connect chronoplast_test

\i chronoplast-schema.sql
\i chronoplast-test-seed.sql