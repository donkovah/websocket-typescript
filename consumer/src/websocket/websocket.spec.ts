import WebSocket from 'ws';
import { WeatherStreamClient } from './websocket';
import { CandlestickAggregator } from '../agregator/aggregator';

// Mock the 'ws' module
jest.mock('ws');

describe('WeatherStreamClient', () => {
  let aggregator: CandlestickAggregator;
  let client: WeatherStreamClient;

  // We'll create a mocked WebSocket instance with manual control of events
  let wsMock: any;
  const mockUrl = 'ws://weather.test';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a fresh aggregator for each test
    aggregator = new CandlestickAggregator();

    // Mock WebSocket constructor to return our mocked ws instance
    wsMock = {
      on: jest.fn(),
      close: jest.fn(),
    };
    // @ts-ignore override WebSocket constructor
    (WebSocket as jest.Mock).mockImplementation(() => wsMock);

    // Create the client instance (which triggers connection)
    client = new WeatherStreamClient(mockUrl, aggregator);
  });

  test('should create a WebSocket connection with the correct URL', () => {
    expect(WebSocket).toHaveBeenCalledWith(mockUrl);
  });

  test('should register event listeners on the WebSocket', () => {
    expect(wsMock.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(wsMock.on).toHaveBeenCalledWith('message', expect.any(Function));
    expect(wsMock.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(wsMock.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should process valid weather events and add them to aggregator', () => {
    // Find the 'message' event handler
    const messageHandler = wsMock.on.mock.calls.find(
      ([event]: [string]) => event === 'message'
    )[1];

    const validEvent = {
      city: 'Berlin',
      timestamp: '2025-06-23T15:23:45.000Z',
      temperature: 22,
      windspeed: 5,
      winddirection: 180,
    };

    // Spy on aggregator.addEvent
    const addEventSpy = jest.spyOn(aggregator, 'addEvent');

    // Send a valid message (stringified)
    messageHandler(Buffer.from(JSON.stringify(validEvent)));

    // The event should pass validation and call addEvent
    expect(addEventSpy).toHaveBeenCalledWith(validEvent);
  });

  test('should ignore invalid weather events and not call addEvent', () => {
    const messageHandler = wsMock.on.mock.calls.find(
      ([event]: [string]) => event === 'message'
    )[1];

    // Invalid event missing required fields or wrong type
    const invalidEvent = {
      city: 'Berlin',
      temperature: 'hot', // wrong type
    };

    const addEventSpy = jest.spyOn(aggregator, 'addEvent');

    messageHandler(Buffer.from(JSON.stringify(invalidEvent)));

    expect(addEventSpy).not.toHaveBeenCalled();
  });

  test('should attempt reconnect on close event after 3 seconds', () => {
    jest.useFakeTimers();

    const closeHandler = wsMock.on.mock.calls.find(
      ([event]: [string]) => event === 'close'
    )[1];

    // Spy on client's private connect method
    const connectSpy = jest.spyOn(client as any, 'connect');

    closeHandler();

    // No immediate reconnect
    expect(connectSpy).not.toHaveBeenCalled();

    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);

    expect(connectSpy).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('should close the websocket and clear reconnect timeout on client.close()', () => {
    jest.useFakeTimers();

    // Simulate reconnect timeout set
    (client as any).reconnectTimeout = setTimeout(() => {}, 10000);

    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    client.close();

    expect(wsMock.close).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalledWith((client as any).reconnectTimeout);

    jest.useRealTimers();
  });

  test('should close websocket on error event', () => {
    const errorHandler = wsMock.on.mock.calls.find(
      ([event]: [string]) => event === 'error'
    )[1];

    errorHandler(new Error('Test error'));

    expect(wsMock.close).toHaveBeenCalled();
  });
});
