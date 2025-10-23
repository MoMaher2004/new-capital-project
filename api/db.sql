use newCapital;

CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        isAdmin BOOLEAN NOT NULL DEFAULT 0,
        isDeleted BOOLEAN NOT NULL DEFAULT 0,
        passwordResetToken VARCHAR(255),
        passwordResetTokenExpiresAt DATETIME,
        passwordLastUpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        isEmailConfirmed BOOLEAN NOT NULL DEFAULT 1,
        emailConfirmationToken VARCHAR(255)
    );

INSERT INTO
    users (
        name,
        email,
        password,
        isAdmin,
        isDeleted,
        isEmailConfirmed
    )
VALUES
    (
        'John',
        'em0ma.jo0h0nson@example.com',
        '$2b$12$t/48RZCaRyongT9eGd/50eYqyZK7Wbj8ErapJ1cr07Ew8QbVlbjcu',
        1,
        0,
        1
    );

CREATE TABLE
    reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileName VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        ARname VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        ARrole VARCHAR(255) NOT NULL,
        content VARCHAR(255) NOT NULL,
        ARcontent VARCHAR(255) NOT NULL
    );

CREATE TABLE
    categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileName VARCHAR(255) NULL,
        name VARCHAR(255) NOT NULL,
        ARname VARCHAR(255) NOT NULL
    );

CREATE TABLE
    subCategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileName VARCHAR(255) NULL,
        name VARCHAR(255) NOT NULL,
        ARname VARCHAR(255) NOT NULL,
        categoryId INT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE RESTRICT
    );

CREATE TABLE
    projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        ARtitle VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        ARdescription TEXT NOT NULL,
        link VARCHAR(255),
        subCategoryId INT NOT NULL,
        showOnHome1 BOOLEAN NOT NULL DEFAULT 0,
        showOnHome2 BOOLEAN NOT NULL DEFAULT 0,
        searchText TEXT NOT NULL,
        FOREIGN KEY (subCategoryId) REFERENCES subCategories (id) ON DELETE RESTRICT
    );

CREATE TABLE
    projectMedia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NOT NULL,
        fileName VARCHAR(255) NOT NULL,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
    );

CREATE TABLE
    slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileName VARCHAR(255) NOT NULL,
        backText VARCHAR(255) NOT NULL,
        ARbackText VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        ARtitle VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        ARdescription VARCHAR(255) NOT NULL,
        url VARCHAR(255) NULL
    );

CREATE TABLE
    members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fileName VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        ARname VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        ARrole VARCHAR(255) NOT NULL,
        facebookUrl VARCHAR(255),
        instagramUrl VARCHAR(255),
        xUrl VARCHAR(255),
        customLink VARCHAR(255)
    );

CREATE TABLE
    messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        message TEXT NOT NULL
    );

CREATE TABLE
    comparisons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        `before` VARCHAR(255) NOT NULL,
        `after` VARCHAR(255) NOT NULL,
    );