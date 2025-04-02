-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2025 at 12:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `timedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_user`
--

CREATE TABLE `app_user` (
  `id` int(11) NOT NULL,
  `login_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `login_date` date NOT NULL DEFAULT current_timestamp(),
  `login_time` time DEFAULT NULL,
  `login_streak` int(11) DEFAULT NULL,
  `total_points` int(11) DEFAULT NULL,
  `fk_dashboard` int(11) DEFAULT NULL,
  `fk_preferences` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_calendar_Event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendar_event`
--

CREATE TABLE `calendar_event` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `created_time` time DEFAULT NULL,
  `fk_app_user` int(11) NOT NULL,
  `fk_calendar_Event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `fk_preferences` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_members`
--

CREATE TABLE `event_members` (
  `fk_calendar_Event` int(11) NOT NULL,
  `fk_app_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `desription` varchar(255) DEFAULT NULL,
  `created_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notebook`
--

CREATE TABLE `notebook` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_activity`
--

CREATE TABLE `note_activity` (
  `id` int(11) NOT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `fk_note` int(11) NOT NULL,
  `fk_app_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_attachment`
--

CREATE TABLE `note_attachment` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `fk_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_members`
--

CREATE TABLE `note_members` (
  `fk_note` int(11) NOT NULL,
  `fk_app_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sent_date` date DEFAULT NULL,
  `sent_time` time DEFAULT NULL,
  `remind_later` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_center`
--

CREATE TABLE `notification_center` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_notifications` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `points`
--

CREATE TABLE `points` (
  `id` int(11) NOT NULL,
  `received_date` date DEFAULT NULL,
  `received_time` time DEFAULT NULL,
  `fk_app_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `id` int(11) NOT NULL,
  `primary_color` varchar(255) DEFAULT NULL,
  `secondary_color` varchar(255) DEFAULT NULL,
  `theme_mode` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE `theme` (
  `id_theme` int(11) NOT NULL,
  `name` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `theme`
--

INSERT INTO `theme` (`id_theme`, `name`) VALUES
(1, 'light'),
(2, 'dark'),
(3, 'auto'),
(4, 'custom');

-- --------------------------------------------------------

--
-- Table structure for table `todo_item`
--

CREATE TABLE `todo_item` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `is_checked` tinyint(1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `fk_dashboard` int(11) NOT NULL,
  `fk_app_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `has` (`fk_dashboard`),
  ADD KEY `configures` (`fk_preferences`);

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`fk_dashboard`,`fk_calendar_Event`),
  ADD KEY `has_events` (`fk_calendar_Event`);

--
-- Indexes for table `calendar_event`
--
ALTER TABLE `calendar_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `writes` (`fk_app_user`),
  ADD KEY `assigned` (`fk_calendar_Event`);

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `effects` (`fk_preferences`);

--
-- Indexes for table `event_members`
--
ALTER TABLE `event_members`
  ADD PRIMARY KEY (`fk_calendar_Event`,`fk_app_user`),
  ADD KEY `is_event_member` (`fk_app_user`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notebook`
--
ALTER TABLE `notebook`
  ADD PRIMARY KEY (`fk_dashboard`,`fk_note`),
  ADD KEY `has_notes` (`fk_note`);

--
-- Indexes for table `note_activity`
--
ALTER TABLE `note_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `belongs_to` (`fk_note`),
  ADD KEY `makes` (`fk_app_user`);

--
-- Indexes for table `note_attachment`
--
ALTER TABLE `note_attachment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `placed_in` (`fk_note`);

--
-- Indexes for table `note_members`
--
ALTER TABLE `note_members`
  ADD PRIMARY KEY (`fk_note`,`fk_app_user`),
  ADD KEY `is_note_member` (`fk_app_user`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_center`
--
ALTER TABLE `notification_center`
  ADD PRIMARY KEY (`fk_dashboard`,`fk_notifications`),
  ADD KEY `has_notifications` (`fk_notifications`);

--
-- Indexes for table `points`
--
ALTER TABLE `points`
  ADD PRIMARY KEY (`id`),
  ADD KEY `given_to` (`fk_app_user`);

--
-- Indexes for table `preferences`
--
ALTER TABLE `preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `theme_mode` (`theme_mode`);

--
-- Indexes for table `theme`
--
ALTER TABLE `theme`
  ADD PRIMARY KEY (`id_theme`);

--
-- Indexes for table `todo_item`
--
ALTER TABLE `todo_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inside_todo` (`fk_dashboard`),
  ADD KEY `creates_todo` (`fk_app_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `calendar_event`
--
ALTER TABLE `calendar_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note_activity`
--
ALTER TABLE `note_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note_attachment`
--
ALTER TABLE `note_attachment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `points`
--
ALTER TABLE `points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `preferences`
--
ALTER TABLE `preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `todo_item`
--
ALTER TABLE `todo_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_user`
--
ALTER TABLE `app_user`
  ADD CONSTRAINT `configures` FOREIGN KEY (`fk_preferences`) REFERENCES `preferences` (`id`),
  ADD CONSTRAINT `has` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`);

--
-- Constraints for table `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `calendar_placed_in` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`),
  ADD CONSTRAINT `has_events` FOREIGN KEY (`fk_calendar_Event`) REFERENCES `calendar_event` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `assigned` FOREIGN KEY (`fk_calendar_Event`) REFERENCES `calendar_event` (`id`),
  ADD CONSTRAINT `writes` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `effects` FOREIGN KEY (`fk_preferences`) REFERENCES `preferences` (`id`);

--
-- Constraints for table `event_members`
--
ALTER TABLE `event_members`
  ADD CONSTRAINT `edit_event` FOREIGN KEY (`fk_calendar_Event`) REFERENCES `calendar_event` (`id`),
  ADD CONSTRAINT `is_event_member` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `notebook`
--
ALTER TABLE `notebook`
  ADD CONSTRAINT `has_notes` FOREIGN KEY (`fk_note`) REFERENCES `note` (`id`),
  ADD CONSTRAINT `notebook_placed_in` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`);

--
-- Constraints for table `note_activity`
--
ALTER TABLE `note_activity`
  ADD CONSTRAINT `belongs_to` FOREIGN KEY (`fk_note`) REFERENCES `note` (`id`),
  ADD CONSTRAINT `makes` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `note_attachment`
--
ALTER TABLE `note_attachment`
  ADD CONSTRAINT `placed_in` FOREIGN KEY (`fk_note`) REFERENCES `note` (`id`);

--
-- Constraints for table `note_members`
--
ALTER TABLE `note_members`
  ADD CONSTRAINT `edit_note` FOREIGN KEY (`fk_note`) REFERENCES `note` (`id`),
  ADD CONSTRAINT `is_note_member` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `notification_center`
--
ALTER TABLE `notification_center`
  ADD CONSTRAINT `has_notifications` FOREIGN KEY (`fk_notifications`) REFERENCES `notifications` (`id`),
  ADD CONSTRAINT `notification_center_placed_in` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`);

--
-- Constraints for table `points`
--
ALTER TABLE `points`
  ADD CONSTRAINT `given_to` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `preferences`
--
ALTER TABLE `preferences`
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`theme_mode`) REFERENCES `theme` (`id_theme`);

--
-- Constraints for table `todo_item`
--
ALTER TABLE `todo_item`
  ADD CONSTRAINT `creates_todo` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`id`),
  ADD CONSTRAINT `inside_todo` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
