SELECT *
FROM Vehicles
    JOIN Users
    ON Vehicles.ownerId = users.id
WHERE users.firstname LIKE $1;