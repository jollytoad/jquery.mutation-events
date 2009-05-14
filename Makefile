PACKAGE = jquery-mutations

SRC_DIR = src
BUILD_DIR = build
DIST_DIR = dist

MODULES = ${SRC_DIR}/mutations.core.js\
	${SRC_DIR}/mutations.attr.js\
	${SRC_DIR}/mutations.data.js\
	${SRC_DIR}/mutations.html.js\
	${SRC_DIR}/mutations.val.js

include ${BUILD_DIR}/rules.mk

