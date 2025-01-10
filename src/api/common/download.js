import axios from 'axios'
import { saveAs } from 'file-saver'
import errorCode from '~/utils/errorCode'
import {message} from "ant-design-vue";

const baseURL = import.meta.env.VITE_APP_BASE_API ?? '/platform/'

async function blobValidate(data) {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
}

class FileDownloader {
    /**
     * @param url
     * @param fileName 文件名
     * @param isDelete
     * @param cb 回调函数
     * @param chunkSize 切片大小
     */
    constructor({url, fileName, isDelete = true, cb, chunkSize = 500 * 1024 * 1024, }) {
        this.url = url;
        this.isDelete = isDelete
        this.fileName = fileName;
        this.chunkSize = chunkSize;
        this.fileSize = 0;
        this.totalChunks = 0;
        this.currentChunk = 0;
        this.downloadedSize = 0;
        this.chunks = [];
        this.abortController = new AbortController();
        this.paused = false;
        this.cb = cb
    }

    async getFileSize() {
        const response = await fetch(this.url, {
            signal: this.abortController.signal,
            headers: { 'Authorization': 'Bearer ' + useAuthorization().value },
            // responseType: 'blob',
        });

        const contentLength = response.headers.get("content-length");
        this.fileSize = parseInt(contentLength);
        this.totalChunks = Math.ceil(this.fileSize / this.chunkSize);
        return response
    }

    async downloadChunk(chunkIndex) {
        const start = chunkIndex * this.chunkSize;
        const end = Math.min(this.fileSize, (chunkIndex + 1) * this.chunkSize - 1);

        // const response = await fetch(this.url, {
        //   headers: { Range: `bytes=${start}-${end}` },
        //   signal: this.abortController.signal
        // });
        const response = await fetch(this.url, {
            signal: this.abortController.signal,
            headers: {
                'Authorization': 'Bearer ' + useAuthorization().value,
                Range: `bytes=${start}-${end}`
            },
            // responseType: 'blob',
        });

        const blob = await response.blob();
        this.chunks[chunkIndex] = blob;
        this.downloadedSize += blob.size;

        if (!this.paused && this.currentChunk < this.totalChunks - 1) {
            this.currentChunk++;
            await this.downloadChunk(this.currentChunk);
        } else if (this.currentChunk === this.totalChunks - 1) {
            await this.mergeChunks();
        }
    }

    async startDownload() {
        if (this.chunks.length === 0) {
            let response = await this.getFileSize();
            if (this.fileSize < (500 * 1024 * 1023)) {
                const blob = await response.blob();
                this.chunks[0] = blob;
                this.downloadedSize += blob.size;
                await this.mergeChunks();
                // this.cb(this.fileName, this.isDelete)
                return;
            }
        }
        await this.downloadChunk(this.currentChunk);
    }

    pauseDownload() {
        this.paused = true;
    }

    resumeDownload() {
        this.paused = false;
        this.downloadChunk(this.currentChunk);
    }

    cancelDownload() {
        this.abortController.abort();
        this.reset();
    }

    async mergeChunks() {
        const blob = new Blob(this.chunks, { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            this.cb && this.cb({
                downState: 1
            })
            this.reset();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    reset() {
        this.chunks = [];
        this.fileName = '';
        this.fileSize = 0;
        this.totalChunks = 0;
        this.currentChunk = 0;
        this.downloadedSize = 0;
    }
}
export default {
    name(name, isDelete = true) {
        // isDelete入参全都传false
        let del = false
        var url = baseURL + "/common/download?fileName=" + encodeURI(name) + "&delete=" + del
        let params = {
            url,
            fileName: name,
            isDelete,
        }
        let downloader = new FileDownloader(params)
        downloader.startDownload()
    },
    resource(resource) {
        var url = baseURL + "/common/download/resource?resource=" + encodeURI(resource);
        axios({
            method: 'get',
            url: url,
            responseType: 'blob',
            headers: { 'Authorization': 'Bearer ' + useAuthorization().value }
        }).then(async (res) => {
            const isLogin = await blobValidate(res.data);
            if (isLogin) {
                const blob = new Blob([res.data])
                this.saveAs(blob, decodeURI(res.headers['download-filename']))
            } else {
                this.printErrMsg(res.data);
            }
        })
    },
    zip(url, name) {
        url = baseURL + url
        axios({
            method: 'get',
            url: url,
            responseType: 'blob',
            headers: { 'Authorization': 'Bearer ' + useAuthorization().value }
        }).then(async (res) => {
            const isLogin = await blobValidate(res.data);
            if (isLogin) {
                const blob = new Blob([res.data], { type: 'application/zip' })
                this.saveAs(blob, name)
            } else {
                this.printErrMsg(res.data);
            }
        })
    },
    saveAs(text, name, opts) {
        saveAs(text, name, opts);
    },
    files(url,name){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (this.status === 200) {
                const blob = this.response;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        };
        xhr.send();
    },
    async printErrMsg(data) {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        message.error(errMsg);
    }
}

