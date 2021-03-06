import React, { useState, useRef } from 'react';

interface Message {
  header: string;
  message: string;
  error?: boolean;
}

export const AuthorizeDataForm = () => {
  const formElement = useRef<HTMLFormElement>(null);

  const [status, setStatus] = useState<'ready' | 'signing'>('ready');
  const [personalNumber, setPersonalNumber] = useState<string>('');
  const [infectedAppId, setInfectedAppId] = useState<string>('');

  const [message, setMessage] = useState<Message | undefined>(undefined);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'personalNumber') {
      setPersonalNumber(event.target.value);
    } else if (event.target.name === 'infectedAppId') {
      setInfectedAppId(event.target.value);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('signing');
    if (message) setMessage(undefined);

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ personalNumber, infectedAppId }),
    };

    try {
      const response = await fetch(
        process.env.SERVER_URL + '/hcpAuthorizeData',
        options,
      );

      if (response.status === 200) {
        if (formElement.current) {
          formElement.current.reset();
        }

        setMessage({
          header: 'Signeringen lyckades!',
          message: 'Din rapportering är registrerad. Tack för din medverkan.',
        });
      } else {
        setMessage({
          header: 'Signeringen misslyckades.',
          message:
            'Ett tekniskt fel uppstod. Testa att signera igen om en stund.',
          error: true,
        });
      }

      setStatus('ready');
    } catch (error) {
      console.error(error.name, error.message);
      setMessage({
        header: 'Signeringen misslyckades',
        message:
          'Ett tekniskt fel uppstod. Testa att signera igen om en stund.',
        error: true,
      });
      setStatus('ready');
    }
  };

  const AwaitSigningOverlay = (props: { visible: boolean }) => (
    <div
      className={props.visible ? 'awaiting-signing' : 'awaiting-signing hidden'}
    >
      <p>Starta BankID-appen</p>

      <style jsx>{`
        .awaiting-signing {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.85);
          opacity: 1;
          transition: 0.4s opacity;
        }

        .awaiting-signing.hidden {
          z-index: -10;
          opacity: 0;
          background-color: green;
        }

        .awaiting-signing p {
          font-weight: 600;
          max-width: 50%;
          text-align: center;
        }
      `}</style>
    </div>
  );

  const MessageBox = (props: {
    message: Message | undefined;
    visible: boolean;
  }) => {
    if (props.message && props.visible) {
      const classes = `messageBox 
      ${
        (props.message.error ? 'error ' : '') + (props.visible ? 'visible' : '')
      }`;

      return (
        <div className={classes}>
          <p className="header">{props.message.header}</p>
          <p className="message">{props.message.message}</p>

          <style jsx>{`
            .messageBox {
              border-radius: 2px;
              color: rgb(21, 87, 36);
              background-color: rgba(212, 237, 218, 0.6);
              padding: 1em;
              margin-bottom: 1em;
            }

            .messageBox.error {
              color: rgb(133, 104, 3);
              background-color: rgba(255, 243, 205, 0.6);
            }

            p {
              margin: 0 0 0.61em 0;
            }

            .header {
              font-weight: bold;
              text-align: center;
            }
          `}</style>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <form
      method="post"
      action="#"
      ref={formElement}
      onSubmit={handleFormSubmit}
    >
      <h3>
        <img src="/outline_assignment_black_18dp.png" className="reportIcon" />{' '}
        Anmäl positivt provsvar
      </h3>

      <MessageBox message={message} visible={typeof message !== undefined} />

      <input
        type="text"
        placeholder="Ditt personnummer"
        name="personalNumber"
        id="personalNumber"
        onChange={handleInputChange}
      />

      <input
        type="text"
        placeholder="Den smittade personens app-kod"
        name="infectedAppId"
        id="infectedAppId"
        onChange={handleInputChange}
      />

      <input type="submit" value="Signera med BankID" />

      <AwaitSigningOverlay visible={status === 'signing'} />

      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        h3 {
          margin-top: 0;
        }

        .reportIcon {
          height: 1.5em;
          margin-right: 0.4em;
          transform: translateY(0.3em);
        }

        input {
          margin-bottom: 0.5em;
        }

        #personalNumber {
          background-image: url('bankid_low_index.gif');
          background-repeat: no-repeat;
          background-position: 97% center;
          background-size: auto 70%;
        }
      `}</style>
    </form>
  );
};
