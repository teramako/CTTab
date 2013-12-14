
VERSION = $(shell sed -n 's,^.*<em:version>\(.*\)</em:version>.*$$,\1,p' install.rdf)
TARGET = cttab-${VERSION}.xpi
DIRS = content modules locale skin
FILES = install.rdf chrome.manifest
CONTENTS = $(shell find ${DIRS} ! -name ".*")

.PHONY: clean
xpi: .xpi

clean:
	-rm ${TARGET}

${TARGET}: ${FILES} ${CONTENTS}
	@if [ -f ${TARGET} ];then rm ${TARGET}; fi
	zip $@ -r ${FILES} ${CONTENTS}
	@echo created $@

.xpi: ${TARGET}
	@ls -l ${TARGET}


# vim: set noet:
