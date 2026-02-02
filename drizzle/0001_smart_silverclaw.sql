CREATE TABLE `configurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`processorId` int,
	`gpuId` int,
	`ramType` varchar(64),
	`ramModules` int DEFAULT 0,
	`storageConfig` text,
	`pciExpress1x4` int DEFAULT 0,
	`pciExpress1x8` int DEFAULT 0,
	`pciExpress1x16` int DEFAULT 0,
	`opticalDrives` int DEFAULT 0,
	`fans` int DEFAULT 0,
	`totalWatts` int NOT NULL,
	`recommendedPSU` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `configurations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gpus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(64) NOT NULL,
	`model` varchar(255) NOT NULL,
	`series` varchar(64),
	`watts` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gpus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(64) NOT NULL,
	`socket` varchar(64) NOT NULL,
	`model` varchar(255) NOT NULL,
	`watts` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `processors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storage_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(64) NOT NULL,
	`wattsPerUnit` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storage_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `storage_types_type_unique` UNIQUE(`type`)
);
