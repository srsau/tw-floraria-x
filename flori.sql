DROP TABLE IF EXISTS flori;
DROP TYPE IF EXISTS categorie_flori;
DROP TYPE IF EXISTS tipuri_produse;
DROP TYPE IF EXISTS culoare_flori;

CREATE TYPE categorie_flori AS ENUM( 'pentru aniversari', 'ziua indragostitilor', 'pentru mama', 'pentru 8 martie', 'ocazii speciale');
CREATE TYPE tipuri_produse AS ENUM('floare singura', 'buchet', 'ghiveci');
CREATE TYPE tip_culoare_predominanta AS ENUM('rosu', 'mov', 'albastru', 'galben','roz','alb');


CREATE TABLE IF NOT EXISTS flori (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   rezistenta_zile INT NOT NULL CHECK (rezistenta_zile>=0),   
   tip_produs tipuri_produse DEFAULT 'floare singura',
   culoare_predominanta tip_culoare_predominanta DEFAULT 'rosu',
   categorie categorie_flori DEFAULT 'pentru aniversari',
   compozitie_buchet VARCHAR [],
   livrare_azi BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO flori (nume, descriere, pret, rezistenta_zile, tip_produs, culoare_predominanta, categorie, compozitie_buchet, livrare_azi, imagine)
VALUES
('Trandafiri', 'Buchet trandafiri rosii', 75.00, 5, 'buchet', 'rosu', 'pentru aniversari', '{"trandafiri rosii"}', FALSE, 'buchet-trandafiri-rosii.jpg'),
('Lalele roz', 'Buchet de lalele roz', 60.00, 4, 'buchet', 'roz', 'ziua indragostitilor', '{"lalele roz", "verdeata decorativa"}', TRUE, 'lalele-buchet.jpg'),
('Frezii', 'Buchet parfumat de frezii colorate', 80.00, 5, 'buchet', 'mov', 'pentru mama', '{"frezii mov", "frezii galbene", "frezii albe"}', FALSE, 'buchet-frezii.jpg'),
('Garoafe', 'Buchet clasic de garoafe', 45.00, 3, 'buchet', 'roz', 'pentru 8 martie', '{"garoafe roz", "garoafe albastre"}', TRUE, 'garoafe-buchet.jpg'),
('Orhidee', 'Orhidee albă', 35.00, 7, 'floare singura', 'alb', 'ocazii speciale', NULL, FALSE, 'orhidee-alba.jpg'),
('Crin', 'Un crin galben deosebit', 70.00, 4, 'floare singura', 'galben', 'pentru aniversari', NULL, TRUE, 'crin-galben.jpg'),
('Mac', 'Mac rosu', 55.00, 3, 'floare singura', 'rosu', 'pentru mama', NULL, FALSE, 'maci.jpg'),
('Iris', 'Iris delicat albastru', 65.00, 5, 'floare singura', 'albastru', 'ziua indragostitilor', NULL, TRUE, 'iris-albastru.jpg'),
('Trandafir mov', 'Un fir de trandafir mov', 85.00, 6, 'floare singura', 'mov', 'ocazii speciale', NULL, FALSE, 'trandafir-mov.jpg'),
('Zambila', 'Buchet colorat de zambile', 40.00, 4, 'buchet', 'albastru', 'pentru 8 martie', '{"zambile albastre", "zambile albe", "zambile roz"}', TRUE, 'zambile.jpg'),
('Bujori', 'Buchet de bujori roz', 50.00, 3, 'buchet', 'roz', 'pentru mama', '{"bujori roz", "verdeata decorativa"}', FALSE, 'bujori-roz.jpg'),
('Buchet trandafiri&garoafe', 'Un buchet pentru persoanele dragi', 30.00, 5, 'buchet', 'roz', 'ziua indragostitilor', '{"trandafiri roz", "garoafe roz"}', FALSE, 'buchet-garoafe.jpg'),
('Lalele', 'Buchet de lalele rosii', 55.00, 4, 'buchet', 'rosu', 'pentru aniversari', '{"lalele roz", "verdeata decorativa"}', TRUE, 'lalele-rosii-buchet.jpg'),
('Buchet unic', 'Pentru situatiile unice', 50.00, 4, 'buchet', 'alb', 'ocazii speciale', '{"trandafiri roz","lisianthus","frezie"}', FALSE, 'unic-buchet.jpg'),
('Buchetul X', 'Are un miros de neuitat!', 45.00, 3, 'buchet', 'alb', 'pentru mama', '{"trandafiri","crizanteme","orhidee alba"}', TRUE, 'buchet-x.jpg');


SELECT DISTINCT UNNEST(compozitie_buchet) AS tip_compozitie_buchet
FROM flori
WHERE compozitie_buchet IS NOT NULL;

SELECT *
FROM flori
WHERE compozitie_buchet IS NOT NULL
AND ARRAY_TO_STRING(compozitie_buchet, ', ') ILIKE '%garoafe%';


