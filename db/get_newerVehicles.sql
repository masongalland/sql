SELECT Vehicles.*, users.firstname, users.lastname
FROM Vehicles
    JOIN Users
    ON Vehicles.ownerId = users.id
WHERE Vehicles.year > 2000
ORDER BY Vehicles.year DESC;