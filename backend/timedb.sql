-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2025 at 11:56 PM
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
  `login_name` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL,
  `login_date` date NOT NULL DEFAULT current_timestamp(),
  `login_streak` int(11) DEFAULT NULL,
  `total_points` int(11) DEFAULT NULL,
  `fk_dashboard` int(11) NOT NULL,
  `fk_preferences` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `app_user`
--

INSERT INTO `app_user` (`login_name`, `password`, `login_date`, `login_streak`, `total_points`, `fk_dashboard`, `fk_preferences`) VALUES
('useris', 'pw', '2025-03-19', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_calendar_Event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `calendar`
--

INSERT INTO `calendar` (`fk_dashboard`, `fk_calendar_Event`) VALUES
(1, 10),
(1, 12),
(1, 14),
(1, 15);

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

--
-- Dumping data for table `calendar_event`
--

INSERT INTO `calendar_event` (`id`, `title`, `description`, `event_date`, `start_time`, `end_time`) VALUES
(10, 'pirmas', 'abb', '2025-03-20', '00:00:00', '01:00:00'),
(12, 'aaa', '', '2025-03-20', '20:00:00', '21:30:00'),
(14, 'aaaa', '', '2025-03-19', '22:00:00', '23:00:00'),
(15, 'vvvv', '', '2025-03-19', '22:00:00', '23:00:00'),
(16, 'new', 'ccc', '2025-03-22', '09:13:27', '20:13:27');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `description` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `created_date` date NOT NULL DEFAULT current_timestamp(),
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL,
  `fk_calendar_Event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `description`, `created_date`, `fk_app_user`, `fk_calendar_Event`) VALUES
(1, 'komentaras', '2025-03-19', 'useris', 10);

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `fk_preferences` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `dashboard`
--

INSERT INTO `dashboard` (`id`, `title`, `fk_preferences`) VALUES
(1, 'main', 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_members`
--

CREATE TABLE `event_members` (
  `fk_calendar_Event` int(11) NOT NULL,
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `event_members`
--

INSERT INTO `event_members` (`fk_calendar_Event`, `fk_app_user`) VALUES
(10, 'useris');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `created_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `note`
--

INSERT INTO `note` (`id`, `title`, `content`, `created_date`) VALUES
(1, 'uzrasas', 'aaaaaa sssssssss', '2025-03-19');

-- --------------------------------------------------------

--
-- Table structure for table `notebook`
--

CREATE TABLE `notebook` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `notebook`
--

INSERT INTO `notebook` (`fk_dashboard`, `fk_note`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `note_activity`
--

CREATE TABLE `note_activity` (
  `id` int(11) NOT NULL,
  `activity` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `fk_note` int(11) NOT NULL,
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `note_activity`
--

INSERT INTO `note_activity` (`id`, `activity`, `created_date`, `fk_note`, `fk_app_user`) VALUES
(1, 'sukurtas uzrasas', '2025-03-19', 1, 'useris');

-- --------------------------------------------------------

--
-- Table structure for table `note_attachment`
--

CREATE TABLE `note_attachment` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `file_type` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `fk_note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `note_members`
--

CREATE TABLE `note_members` (
  `fk_note` int(11) NOT NULL,
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `note_members`
--

INSERT INTO `note_members` (`fk_note`, `fk_app_user`) VALUES
(1, 'useris');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `sent_date` date DEFAULT NULL,
  `sent_time` time DEFAULT NULL,
  `remind_later` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `sent_date`, `sent_time`, `remind_later`) VALUES
(1, 'hello world', 'goodbye world', '2025-03-18', '19:57:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification_center`
--

CREATE TABLE `notification_center` (
  `fk_dashboard` int(11) NOT NULL,
  `fk_notifications` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `notification_center`
--

INSERT INTO `notification_center` (`fk_dashboard`, `fk_notifications`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `points`
--

CREATE TABLE `points` (
  `id` int(11) NOT NULL,
  `received_date` date DEFAULT NULL,
  `received_time` time DEFAULT NULL,
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `points`
--

INSERT INTO `points` (`id`, `received_date`, `received_time`, `fk_app_user`) VALUES
(1, '2025-03-19', '20:57:47', 'useris');

-- --------------------------------------------------------

--
-- Table structure for table `preferences`
--

CREATE TABLE `preferences` (
  `id` int(11) NOT NULL,
  `primary_color` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `secondary_color` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `theme_mode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `preferences`
--

INSERT INTO `preferences` (`id`, `primary_color`, `secondary_color`, `theme_mode`) VALUES
(1, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE `theme` (
  `id_theme` int(11) NOT NULL,
  `name` char(6) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
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
  `title` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci DEFAULT NULL,
  `is_checked` tinyint(1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `fk_dashboard` int(11) NOT NULL,
  `fk_app_user` varchar(255) CHARACTER SET utf16 COLLATE utf16_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `todo_item`
--

INSERT INTO `todo_item` (`id`, `title`, `is_checked`, `start_date`, `start_time`, `end_date`, `end_time`, `fk_dashboard`, `fk_app_user`) VALUES
(1, 'aa', 0, '2025-03-19', '22:48:28', '2025-03-19', '23:48:28', 1, 'useris'),
(2, 'todo', 0, '2025-03-19', '23:58:11', '2025-03-20', '18:58:11', 1, 'useris');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`login_name`),
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
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `fk_dashboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `calendar_event`
--
ALTER TABLE `calendar_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_members`
--
ALTER TABLE `event_members`
  MODIFY `fk_calendar_Event` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notebook`
--
ALTER TABLE `notebook`
  MODIFY `fk_dashboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `note_activity`
--
ALTER TABLE `note_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `note_attachment`
--
ALTER TABLE `note_attachment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `note_members`
--
ALTER TABLE `note_members`
  MODIFY `fk_note` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notification_center`
--
ALTER TABLE `notification_center`
  MODIFY `fk_dashboard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `points`
--
ALTER TABLE `points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `preferences`
--
ALTER TABLE `preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `todo_item`
--
ALTER TABLE `todo_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `writes` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`);

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
  ADD CONSTRAINT `is_event_member` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`);

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
  ADD CONSTRAINT `makes` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`);

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
  ADD CONSTRAINT `is_note_member` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`);

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
  ADD CONSTRAINT `given_to` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`);

--
-- Constraints for table `preferences`
--
ALTER TABLE `preferences`
  ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`theme_mode`) REFERENCES `theme` (`id_theme`);

--
-- Constraints for table `todo_item`
--
ALTER TABLE `todo_item`
  ADD CONSTRAINT `creates_todo` FOREIGN KEY (`fk_app_user`) REFERENCES `app_user` (`login_name`),
  ADD CONSTRAINT `inside_todo` FOREIGN KEY (`fk_dashboard`) REFERENCES `dashboard` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
