import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SpeechRecognitionService} from "../../../services/speech-recognition.service";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-sofia-bot',
  templateUrl: './sofia-bot.component.html',
  styleUrls: ['./sofia-bot.component.scss']
})
export class SofiaBotComponent implements OnInit {
  isRecording = false;
  recordedTime: any
  blobUrl: any
  blobData: any
  text: any
  loader: any
  closeChatModal = true

  constructor(private socketService: SocketService, private audioRecordingService: SpeechRecognitionService, private sanitizer: DomSanitizer) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe(data => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.blobData = data.blob
      console.log('subscribe =>', this.blobData)
    });
  }

  ngOnInit(): void {
  }

  startRecording() {
    console.log('start recording')
    this.closeChatModal = false
    this.text = ''
    if (!this.isRecording) {
      this.isRecording = true;
      console.log('started')
      this.audioRecordingService.startRecording();
      console.log('end')
    }
    console.log('stop')
    setTimeout(() => {
      console.log('stoping recording')
      this.stopRecording()
    }, 5000)
    setTimeout(async () => {
      console.log('sending data', this.blobData)
      let blobString: any
      blobString = await this.convertBlobToString()
      blobString = blobString.substring(22)
      this.socketService.sendMessage(blobString)
    }, 6000)
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  sendData(t: any) {
    this.loader = true
    const formData = new FormData()
    console.log(this.blobData)
    formData.append('file', this.blobData)
    this.audioRecordingService.getTextFromSpeech({test: t}).subscribe(
      (res: any) => {
        this.loader = false
        if (res.status) {
          this.text = res.data
        } else {
          this.text = 'Failed to get response'
        }
      }
    )
  }

  // this will convert the blob to base 64 string
  async convertBlobToString() {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(this.blobData);
    });
  }

  close() {
    this.closeChatModal = true
  }
}
