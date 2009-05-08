PACKAGE = jquery-mutations

SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DOCS_DIR = ${PREFIX}/docs
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist
SPEED_DIR = ${PREFIX}/speed

MODULES = ${SRC_DIR}/mutations.core.js\
	${SRC_DIR}/mutations.attr.js\
	${SRC_DIR}/mutations.data.js\
	${SRC_DIR}/mutations.html.js\
	${SRC_DIR}/mutations.val.js

OUT = ${DIST_DIR}/${PACKAGE}.js
OUT_MIN = ${DIST_DIR}/${PACKAGE}.min.js

VERSION = `cat version.txt`
TODAY = `date +%Y%m%d`
SUB = sed "s/@VERSION/${VERSION}/g; s/@DATE/${TODAY}/g"

JAR = java -Dfile.encoding=utf-8 -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

all: concat
	@@echo ${PACKAGE} "build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

concat: ${DIST_DIR} ${OUT}

${OUT}: ${MODULES}
	@@echo "Building" ${OUT}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | \
		${SUB} > ${OUT};

	@@echo ${OUT} "Built"
	@@echo

min: ${OUT_MIN}

${OUT_MIN}: ${OUT}
	@@echo "Building" ${OUT_MIN}

	@@echo " - Compressing using Minifier"
	@@${MINJAR} ${OUT} > ${OUT_MIN}

	@@echo ${OUT_MIN} "Built"
	@@echo

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

