-- Create the users table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users IF NOT EXISTS (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verified_on TIMESTAMPTZ,
    password TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    deleted_on TIMESTAMPTZ,
    banned_on TIMESTAMPTZ,
    updated_on TIMESTAMPTZ DEFAULT NOW(),
    created_on TIMESTAMPTZ DEFAULT NOW()
);

-- Index for text search and lookup
CREATE INDEX users_email_idx ON users (email);

-- Function and Trigger for is_email_verified
CREATE OR REPLACE FUNCTION update_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_email_verified THEN
        NEW.email_verification_token := NULL;
        NEW.email_verified_on := NOW();
    ELSE
        NEW.email_verified_on := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_email_verification
BEFORE UPDATE OF is_email_verified ON users
FOR EACH ROW
WHEN (NEW.is_email_verified IS DISTINCT FROM OLD.is_email_verified)
EXECUTE FUNCTION update_email_verification();

-- Function and Trigger for updated_on
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Function and Trigger for is_deleted
CREATE OR REPLACE FUNCTION update_deleted_on()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_deleted AND NOT OLD.is_deleted THEN
        NEW.deleted_on := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_deleted_on
BEFORE UPDATE OF is_deleted ON users
FOR EACH ROW
WHEN (NEW.is_deleted IS DISTINCT FROM OLD.is_deleted)
EXECUTE FUNCTION update_deleted_on();

-- Function and Trigger for is_banned
CREATE OR REPLACE FUNCTION update_banned_on()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_banned AND NOT OLD.is_banned THEN
        NEW.banned_on := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_banned_on
BEFORE UPDATE OF is_banned ON users
FOR EACH ROW
WHEN (NEW.is_banned IS DISTINCT FROM OLD.is_banned)
EXECUTE FUNCTION update_banned_on();

-- Function and Trigger for email update
CREATE OR REPLACE FUNCTION reset_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
        NEW.email_verification_token := NULL;
        NEW.email_verified_on := NULL;
        NEW.is_email_verified := FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reset_email_verification
BEFORE UPDATE OF email ON users
FOR EACH ROW
WHEN (NEW.email IS DISTINCT FROM OLD.email)
EXECUTE FUNCTION reset_email_verification();
