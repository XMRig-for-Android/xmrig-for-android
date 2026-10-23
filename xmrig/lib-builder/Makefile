all: clean toolchain libuv hwloc openssl xmrig xmrig-mo install

toolchain:
	script/toolchain-build.sh

libuv: toolchain libuv_dl 
	script/libuv-build.sh

libuv_dl:
	script/libuv-fetch.sh

openssl: toolchain openssl_dl
	script/openssl-build.sh

openssl_dl:
	script/openssl-fetch.sh

xmrig: toolchain xmrig_dl
	script/xmrig-build.sh

xmrig_dl:
	script/xmrig-fetch.sh

xmrig-mo: toolchain xmrig-mo_dl
	script/xmrig-mo-build.sh

xmrig-mo_dl:
	script/xmrig-mo-fetch.sh

hwloc: toolchain hwloc_dl
	script/hwloc-build.sh

hwloc_dl:
	script/hwloc-fetch.sh

install:
	script/install.sh

clean:
	script/clean.sh

