-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2019 at 09:35 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `expense_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `expense_id` int(11) NOT NULL,
  `u_id` varchar(256) NOT NULL,
  `title` varchar(256) NOT NULL,
  `date` varchar(256) NOT NULL,
  `category` varchar(256) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`expense_id`, `u_id`, `title`, `date`, `category`, `amount`) VALUES
(1, 'dard', 'TP', '2019-10-05', 'Other', 500000000),
(2, 'procrastinator', 'Mobile', '2019-10-04', 'Entertainment', 40000),
(3, 'test', 'eating', '2019-10-10', 'Food', 21212);

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `u_id` varchar(256) NOT NULL,
  `title` varchar(256) NOT NULL,
  `amount` int(11) NOT NULL,
  `date` varchar(256) NOT NULL,
  `category` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`u_id`, `title`, `amount`, `date`, `category`) VALUES
('procrastinator', 'Car', 5000000, '2019-10-31', 'Travel'),
('test', 'Car', 12, '2019-10-10', 'Health');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `u_id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'test',
  `password` varchar(100) NOT NULL DEFAULT 'test123',
  `number` varchar(100) NOT NULL DEFAULT '1000000000',
  `salary` int(100) NOT NULL DEFAULT 10000
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`u_id`, `name`, `password`, `number`, `salary`) VALUES
('dard', 'Animesh Ghosh', 'animesh', '7977342344', 30000),
('procrastinator', 'Akshay Kotak', 'kodak', '9167857252', 60000),
('test', 'test1 tt', 'test', '7878', 7878);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`expense_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
