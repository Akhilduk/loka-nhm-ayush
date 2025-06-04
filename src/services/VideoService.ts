import OT from '@opentok/client';

export class VideoService {
  private static instance: VideoService;
  private session: OT.Session | null = null;
  private publisher: OT.Publisher | null = null;
  private subscribers: Record<string, OT.Subscriber> = {};
  private apiKey = 'your_api_key'; // Replace with your OpenTok API key

  private constructor() {}

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  async initSession(sessionId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.session = OT.initSession(this.apiKey, sessionId);

      this.session.on('streamCreated', (event) => {
        const subscriber = this.session!.subscribe(
          event.stream,
          'subscriber',
          {
            insertMode: 'append',
            width: '100%',
            height: '100%',
          },
          (error) => {
            if (error) {
              console.error('Error subscribing to stream:', error);
            } else {
              this.subscribers[event.stream.streamId] = subscriber;
            }
          }
        );
      });

      this.session.on('streamDestroyed', (event) => {
        const subscriber = this.subscribers[event.stream.streamId];
        if (subscriber) {
          subscriber.destroy();
          delete this.subscribers[event.stream.streamId];
        }
      });

      this.session.connect(token, (error) => {
        if (error) {
          reject(error);
        } else {
          this.publisher = OT.initPublisher(
            'publisher',
            {
              insertMode: 'append',
              width: '100%',
              height: '100%',
              publishAudio: true,
              publishVideo: true,
            },
            (error) => {
              if (error) {
                reject(error);
              } else {
                this.session!.publish(this.publisher!, (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              }
            }
          );
        }
      });
    });
  }

  toggleVideo(): void {
    if (this.publisher) {
      this.publisher.publishVideo(!this.publisher.stream.hasVideo);
    }
  }

  toggleAudio(): void {
    if (this.publisher) {
      this.publisher.publishAudio(!this.publisher.stream.hasAudio);
    }
  }

  startScreenShare(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.session) {
        reject(new Error('Session not initialized'));
        return;
      }

      OT.checkScreenSharingCapability((response) => {
        if (!response.supported) {
          reject(new Error('Screen sharing not supported'));
          return;
        }

        const publisher = OT.initPublisher(
          'screen-share',
          {
            videoSource: 'screen',
            publishAudio: false,
            width: '100%',
            height: '100%',
          },
          (error) => {
            if (error) {
              reject(error);
              return;
            }

            this.session!.publish(publisher, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          }
        );
      });
    });
  }

  endSession(): void {
    if (this.publisher) {
      this.session?.unpublish(this.publisher);
      this.publisher.destroy();
      this.publisher = null;
    }

    Object.values(this.subscribers).forEach((subscriber) => {
      subscriber.destroy();
    });
    this.subscribers = {};

    if (this.session) {
      this.session.disconnect();
      this.session = null;
    }
  }

  isVideoEnabled(): boolean {
    return this.publisher?.stream?.hasVideo ?? false;
  }

  isAudioEnabled(): boolean {
    return this.publisher?.stream?.hasAudio ?? false;
  }
}

export const videoService = VideoService.getInstance();