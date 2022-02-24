/*
 Navicat Premium Data Transfer

 Source Server         : 本地数据库
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : localhost:3306
 Source Schema         : gorgeous_admin_server

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 20/02/2022 09:51:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_role
-- ----------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role` (
  `admin_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`admin_id`,`role_id`),
  KEY `IDX_529430c0d487e4872848790949` (`admin_id`),
  KEY `IDX_5834613c9dcc3dd3373f3b6cc0` (`role_id`),
  CONSTRAINT `FK_529430c0d487e48728487909493` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_5834613c9dcc3dd3373f3b6cc05` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admin_role
-- ----------------------------
BEGIN;
INSERT INTO `admin_role` VALUES (1, 1);
COMMIT;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `admin_type` int(11) NOT NULL DEFAULT '1' COMMENT '0系统用户，1手动创建用户',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态：1正常，0禁用',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `creator_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_a4b78db37a8fcafbe1431005ae` (`creator_uid`),
  CONSTRAINT `FK_a4b78db37a8fcafbe1431005ae1` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admins
-- ----------------------------
BEGIN;
INSERT INTO `admins` VALUES (1, '系统管理员', '$argon2i$v=19$m=4096,t=3,p=1$8IL7j3KWRKF7kyct/iOp+Q$xtZlFWZFUHzLlubcl/Q8xtniZw49YNRJqVduZziPDAg', 'zhuhengtan@126.com', 1, 1, '', CURRENT_TIMESTAMP, NULL);
COMMIT;

-- ----------------------------
-- Table structure for operations
-- ----------------------------
DROP TABLE IF EXISTS `operations`;
CREATE TABLE `operations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `related_api` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `page_id` int(11) DEFAULT NULL,
  `creator_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_8617941d945caf965bfae43cc7` (`creator_uid`),
  KEY `FK_1fb259d97fa1be0bfe9affa0bea` (`page_id`),
  CONSTRAINT `FK_1fb259d97fa1be0bfe9affa0bea` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_8617941d945caf965bfae43cc72` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of operations
-- ----------------------------
BEGIN;
INSERT INTO `operations` VALUES (1, '添加页面', 'add', 'POST /api/auth/page', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (2, '查看页面列表', 'view', 'GET /api/auth/pages', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (3, '删除页面', 'delete', 'DELETE /api/auth/page', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (4, '编辑页面', 'update', 'PUT /api/auth/page', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (5, '获取所有接口列表', 'get-all-apis', 'GET /api/auth/all-apis', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (6, '页面详情', 'detail', 'GET /api/auth/page', CURRENT_TIMESTAMP, 1, NULL);
INSERT INTO `operations` VALUES (7, '获取角色列表', 'view', 'GET /api/auth/roles', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (8, '编辑角色', 'edit', 'PUT /api/auth/role', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (9, '创建角色', 'create', 'POST /api/auth/role', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (10, '删除角色', 'delete', 'DELETE /api/auth/role', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (11, '获取所有操作列表', 'get-all-operations', 'GET /api/auth/all-operations', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (12, '删除操作', 'delete-operation', 'DELETE /api/auth/operation', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (13, '角色详情', 'detail', 'GET /api/auth/role', CURRENT_TIMESTAMP, 2, NULL);
INSERT INTO `operations` VALUES (14, '删除用户', 'delete', 'DELETE /api/auth/user', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (15, '编辑用户', 'update', 'PUT /api/auth/user', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (16, '新增用户', 'create', 'POST /api/auth/user', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (17, '用户列表', 'view', 'GET /api/auth/users', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (18, '全部角色', 'all-roles', 'GET /api/auth/all-roles', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (19, '重置密码', 'reset-password', 'POST /api/auth/user/reset-password', CURRENT_TIMESTAMP, 3, NULL);
INSERT INTO `operations` VALUES (20, '用户详情', 'detail', 'GET /api/auth/user', CURRENT_TIMESTAMP, 3, NULL);
COMMIT;

-- ----------------------------
-- Table structure for pages
-- ----------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL COMMENT '前端路由',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of pages
-- ----------------------------
BEGIN;
INSERT INTO `pages` VALUES (1, '页面管理', '/auth/page', CURRENT_TIMESTAMP);
INSERT INTO `pages` VALUES (2, '角色管理', '/auth/role', CURRENT_TIMESTAMP);
INSERT INTO `pages` VALUES (3, '用户管理', '/auth/admin', CURRENT_TIMESTAMP);
COMMIT;

-- ----------------------------
-- Table structure for role_operation
-- ----------------------------
DROP TABLE IF EXISTS `role_operation`;
CREATE TABLE `role_operation` (
  `role_id` int(11) NOT NULL,
  `operation_id` int(11) NOT NULL,
  PRIMARY KEY (`role_id`,`operation_id`),
  KEY `IDX_2c5fdc84e487176038fc7b1817` (`role_id`),
  KEY `IDX_83a0bd85d6686626f8998b046b` (`operation_id`),
  CONSTRAINT `FK_2c5fdc84e487176038fc7b18172` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_83a0bd85d6686626f8998b046b5` FOREIGN KEY (`operation_id`) REFERENCES `operations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of role_operation
-- ----------------------------
BEGIN;
INSERT INTO `role_operation` VALUES (1, 1);
INSERT INTO `role_operation` VALUES (1, 2);
INSERT INTO `role_operation` VALUES (1, 3);
INSERT INTO `role_operation` VALUES (1, 4);
INSERT INTO `role_operation` VALUES (1, 5);
INSERT INTO `role_operation` VALUES (1, 6);
INSERT INTO `role_operation` VALUES (1, 7);
INSERT INTO `role_operation` VALUES (1, 8);
INSERT INTO `role_operation` VALUES (1, 9);
INSERT INTO `role_operation` VALUES (1, 10);
INSERT INTO `role_operation` VALUES (1, 11);
INSERT INTO `role_operation` VALUES (1, 12);
INSERT INTO `role_operation` VALUES (1, 13);
INSERT INTO `role_operation` VALUES (1, 14);
INSERT INTO `role_operation` VALUES (1, 15);
INSERT INTO `role_operation` VALUES (1, 16);
INSERT INTO `role_operation` VALUES (1, 17);
INSERT INTO `role_operation` VALUES (1, 18);
INSERT INTO `role_operation` VALUES (1, 19);
INSERT INTO `role_operation` VALUES (1, 20);
COMMIT;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `creator_uid` int(11) DEFAULT NULL,
  `role_type` int(11) NOT NULL COMMENT '角色类型，1系统角色，2手动创建角色，仅手动创建角色可编辑删除',
  `description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_6fbfce9b9d1efbb2b955b5234a` (`creator_uid`),
  CONSTRAINT `FK_6fbfce9b9d1efbb2b955b5234ab` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of roles
-- ----------------------------
BEGIN;
INSERT INTO `roles` VALUES (1, '超级管理员', CURRENT_TIMESTAMP, NULL, 1, '');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
