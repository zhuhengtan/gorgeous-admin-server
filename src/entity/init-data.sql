/*
 Navicat Premium Data Transfer

 Source Server         : 本机数据库
 Source Server Type    : MySQL
 Source Server Version : 50742 (5.7.42)
 Source Host           : localhost:3306
 Source Schema         : gorgeous_admin_server

 Target Server Type    : MySQL
 Target Server Version : 50742 (5.7.42)
 File Encoding         : 65001

 Date: 12/05/2023 23:56:52
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
INSERT INTO `admin_role` (`admin_id`, `role_id`) VALUES (1, 1);
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
  KEY `FK_a4b78db37a8fcafbe1431005ae1` (`creator_uid`),
  CONSTRAINT `FK_a4b78db37a8fcafbe1431005ae1` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admins
-- ----------------------------
BEGIN;
INSERT INTO `admins` (`id`, `name`, `password`, `email`, `admin_type`, `status`, `avatar`, `created_at`, `creator_uid`) VALUES (1, '系统管理员', '6ad01a96-b6c3-41de-b0a8-3ef878a214b7$1ae34c354f520233ea7b1195f6325854', 'admin@gorgeous-admin.com', 1, 1, '', '2022-03-19 09:43:59.000000', NULL);
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
  KEY `FK_1fb259d97fa1be0bfe9affa0bea` (`page_id`),
  KEY `FK_8617941d945caf965bfae43cc72` (`creator_uid`),
  CONSTRAINT `FK_1fb259d97fa1be0bfe9affa0bea` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_8617941d945caf965bfae43cc72` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of operations
-- ----------------------------
BEGIN;
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (1, '添加页面', 'create', '["POST /api/b/auth/page"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (2, '查看页面列表', 'view', '["GET /api/b/auth/pages"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (3, '删除页面', 'delete', '["DELETE /api/b/auth/page"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (4, '编辑页面', 'update', '["PUT /api/b/auth/page"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (5, '获取所有接口列表', 'get-all-apis', '["GET /api/b/auth/all-apis"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (6, '页面详情', 'detail', '["GET /api/b/auth/page"]', '2022-03-19 09:43:59.000000', 1, 1);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (7, '获取角色列表', 'view', '["GET /api/b/auth/roles"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (8, '编辑角色', 'edit', '["PUT /api/b/auth/role"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (9, '创建角色', 'create', '["POST /api/b/auth/role"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (10, '删除角色', 'delete', '["DELETE /api/b/auth/role"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (11, '获取所有操作列表', 'get-all-operations', '["GET /api/b/auth/all-operations"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (12, '删除操作', 'delete-operation', '["DELETE /api/b/auth/operation"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (13, '角色详情', 'detail', '["GET /api/b/auth/role"]', '2022-03-19 09:43:59.000000', 2, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (14, '删除用户', 'delete', '["DELETE /api/b/auth/admin"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (15, '编辑用户', 'update', '["PUT /api/b/auth/admin"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (16, '新增用户', 'create', '["POST /api/b/auth/admin"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (17, '用户列表', 'view', '["GET /api/b/auth/admins"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (18, '全部角色', 'all-roles', '["GET /api/b/auth/all-roles"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (19, '重置密码', 'reset-password', '["POST /api/b/auth/admin/reset-password"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (20, '用户详情', 'detail', '["GET /api/b/auth/admin"]', '2022-03-19 09:43:59.000000', 3, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (21, '查看', 'view', '["GET /api/b/auth/generated-entities"]', '2022-03-19 09:43:59.000000', 4, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (22, '生成实体', 'create', '["POST /api/b/auth/generate-server-crud"]', '2022-03-19 09:43:59.000000', 4, NULL);
INSERT INTO `operations` (`id`, `name`, `key`, `related_apis`, `created_at`, `page_id`, `creator_uid`) VALUES (23, '更新实体', 'update', '["PUT /api/b/auth/generated-entity"]', '2022-03-19 09:43:59.000000', 4, NULL);
COMMIT;

-- ----------------------------
-- Table structure for pages
-- ----------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL COMMENT '前端路由',
  `page_type` int(11) NOT NULL DEFAULT '0' COMMENT '页面类型，0为手写页面，1为配置页面，2为配置后手写页面（模板生成代码）',
  `content` json DEFAULT NULL COMMENT '配置页面的内容（json）',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of pages
-- ----------------------------
BEGIN;
INSERT INTO `pages` (`id`, `name`, `path`, `page_type`, `content`, `created_at`) VALUES (1, '页面管理', '/auth/page', 0, NULL, '2022-03-19 01:43:59.000000');
INSERT INTO `pages` (`id`, `name`, `path`, `page_type`, `content`, `created_at`) VALUES (2, '角色管理', '/auth/role', 0, NULL, '2022-03-19 09:43:59.000000');
INSERT INTO `pages` (`id`, `name`, `path`, `page_type`, `content`, `created_at`) VALUES (3, '用户管理', '/auth/admin', 0, NULL, '2022-03-19 09:43:59.000000');
INSERT INTO `pages` (`id`, `name`, `path`, `page_type`, `content`, `created_at`) VALUES (4, '生成实体及接口', '/auth/generate-server-crud', 0, NULL, '2022-03-19 09:43:59.000000');
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
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 1);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 2);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 3);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 4);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 5);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 6);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 7);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 8);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 9);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 10);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 11);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 12);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 13);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 14);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 15);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 16);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 17);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 18);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 19);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 20);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 21);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 22);
INSERT INTO `role_operation` (`role_id`, `operation_id`) VALUES (1, 23);
COMMIT;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role_type` int(11) NOT NULL COMMENT '角色类型，1系统角色，2手动创建角色，仅手动创建角色可编辑删除',
  `description` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `creator_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_6fbfce9b9d1efbb2b955b5234ab` (`creator_uid`),
  CONSTRAINT `FK_6fbfce9b9d1efbb2b955b5234ab` FOREIGN KEY (`creator_uid`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of roles
-- ----------------------------
BEGIN;
INSERT INTO `roles` (`id`, `name`, `role_type`, `description`, `created_at`, `creator_uid`) VALUES (1, '超级管理员', 1, '', '2022-03-19 09:43:59.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for generated_entities
-- ----------------------------
DROP TABLE IF EXISTS `generated_entities`;
CREATE TABLE `generated_entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_name` varchar(255) NOT NULL,
  `keys` json NOT NULL COMMENT '字段',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
