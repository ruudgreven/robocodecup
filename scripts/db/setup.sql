/**
A team has a unique id inside a competition
 */
CREATE TABLE team (
  id VARCHAR(16) NOT NULL,
  secretkey VARCHAR(6) NOT NULL,
  robotteam_name VARCHAR(128),
  robotteam_version VARCHAR(10),
  robotteam_author VARCHAR(128),
  robotteam_description VARCHAR(256),
  robotteam_url VARCHAR(256),
  PRIMARY KEY (id)
);