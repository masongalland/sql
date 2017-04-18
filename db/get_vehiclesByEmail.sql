SELECT *
FROM Vehicles
    JOIN Users
    ON Vehicles.ownerId = users.id
WHERE email = $1;