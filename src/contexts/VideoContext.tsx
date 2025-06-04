import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import OT from '@opentok/client';

interface VideoContextType {
  initSession: (sessionId: string, token: string) => void;
  endSession: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  error: string | null;
}

const VideoContext = createContext<VideoContextType>({
  initSession: () => {},
  endSession: () => {},
  toggleVideo: () => {},
  toggleAudio: () => {},
  isVideoEnabled: false,
  isAudioEnabled: false,
  error: null,
});

// Replace with your OpenTok API key
const API_KEY = 'your_api_key';

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<OT.Session | null>(null);
  const [publisher, setPublisher] = useState<OT.Publisher | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    return () => {
      if (session) {
        session.disconnect();
      }
      if (publisher) {
        publisher.destroy();
      }
    };
  }, [session, publisher]);

  const initSession = (sessionId: string, token: string) => {
    const session = OT.initSession(API_KEY, sessionId);

    session.on('streamCreated', (event) => {
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%',
      });
    });

    session.connect(token, (error) => {
      if (error) {
        setError(`Failed to connect: ${error.message}`);
        return;
      }

      const publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%',
      });

      session.publish(publisher, (error) => {
        if (error) {
          setError(`Failed to publish: ${error.message}`);
        }
      });

      setPublisher(publisher);
    });

    setSession(session);
  };

  const endSession = () => {
    if (session) {
      session.disconnect();
      setSession(null);
    }
    if (publisher) {
      publisher.destroy();
      setPublisher(null);
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      publisher.publishVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (publisher) {
      publisher.publishAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        initSession,
        endSession,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
        error,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);