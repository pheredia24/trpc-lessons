---
slug: subscriptions
order: 8
title: Subscriptions - Real-time Updates
---

### Why Now?
Real-time updates become relevant once core data flow is solid.

### Real-life Scenario
Live order book updates on a trading screen via WebSockets.

### Goal
Implement a `priceFeed` subscription emitting random prices; stream them to a chart.

### What You'll Learn
- WebSocket-based real-time communication
- tRPC subscription patterns
- Event-driven architecture
- Client-side subscription management

### Exercise

1. Set up WebSocket connection for subscriptions
2. Create real-time data streaming procedures
3. Handle subscription lifecycle (connect/disconnect)
4. Build reactive UI components

### Example Implementation

```ts
// First, install additional dependencies:
// npm install ws @trpc/server

import { EventEmitter } from 'events';
import { observable } from '@trpc/server/observable';

// Event emitter for real-time events
const eventEmitter = new EventEmitter();

// Subscription procedures
priceFeed: t.procedure
  .input(z.object({ 
    symbol: z.string().min(1).max(10) 
  }))
  .subscription(({ input }) => {
    return observable<{ symbol: string; price: number; timestamp: string }>((emit) => {
      // Generate initial price
      let currentPrice = Math.random() * 1000 + 100;
      
      // Send initial price
      emit.next({
        symbol: input.symbol,
        price: Number(currentPrice.toFixed(2)),
        timestamp: new Date().toISOString(),
      });
      
      // Set up interval for price updates
      const interval = setInterval(() => {
        // Simulate price movement (±5% change)
        const change = (Math.random() - 0.5) * 0.1 * currentPrice;
        currentPrice = Math.max(0.01, currentPrice + change);
        
        emit.next({
          symbol: input.symbol,
          price: Number(currentPrice.toFixed(2)),
          timestamp: new Date().toISOString(),
        });
      }, 1000); // Update every second
      
      // Cleanup function
      return () => {
        clearInterval(interval);
      };
    });
  }),

chatMessages: t.procedure
  .input(z.object({ 
    room: z.string().min(1).max(50) 
  }))
  .subscription(({ input }) => {
    return observable<{ id: string; user: string; message: string; timestamp: string }>((emit) => {
      const handleMessage = (data: any) => {
        if (data.room === input.room) {
          emit.next(data);
        }
      };
      
      // Listen for new messages
      eventEmitter.on('newMessage', handleMessage);
      
      // Cleanup
      return () => {
        eventEmitter.off('newMessage', handleMessage);
      };
    });
  }),

sendMessage: t.procedure
  .input(z.object({
    room: z.string().min(1).max(50),
    user: z.string().min(1).max(50),
    message: z.string().min(1).max(500),
  }))
  .mutation(({ input }) => {
    const messageData = {
      id: Math.random().toString(36).substring(7),
      room: input.room,
      user: input.user,
      message: input.message,
      timestamp: new Date().toISOString(),
    };
    
    // Emit to all subscribers
    eventEmitter.emit('newMessage', messageData);
    
    return { success: true, messageId: messageData.id };
  }),

onlineUsers: t.procedure
  .input(z.object({ 
    room: z.string().min(1).max(50) 
  }))
  .subscription(({ input }) => {
    return observable<{ room: string; count: number; users: string[] }>((emit) => {
      // Simulate changing user count
      const updateUsers = () => {
        const userCount = Math.floor(Math.random() * 50) + 1;
        const users = Array.from({ length: Math.min(userCount, 10) }, (_, i) => 
          `User${i + 1}`
        );
        
        emit.next({
          room: input.room,
          count: userCount,
          users,
        });
      };
      
      // Initial emit
      updateUsers();
      
      // Update every 5 seconds
      const interval = setInterval(updateUsers, 5000);
      
      return () => clearInterval(interval);
    });
  }),
```

### WebSocket Configuration

```ts
// You'll need to set up WebSocket support in your Next.js app
// This requires additional configuration for production deployments

// In development, tRPC can use Server-Sent Events (SSE) as a fallback
// For production WebSockets, consider using a service like Pusher or Ably
```

### Client-Side Usage

```tsx
// Using subscriptions in React components
function PriceChart({ symbol }: { symbol: string }) {
  const [prices, setPrices] = useState<Array<{ price: number; timestamp: string }>>([]);
  
  trpc.priceFeed.useSubscription(
    { symbol },
    {
      onData: (data) => {
        setPrices(prev => [...prev.slice(-50), data]); // Keep last 50 prices
      },
      onError: (error) => {
        console.error('Price feed error:', error);
      },
    }
  );
  
  return (
    <div>
      <h3>Live Prices for {symbol}</h3>
      <div className="price-chart">
        {prices.map((price, index) => (
          <div key={index} className="price-point">
            ${price.price} at {new Date(price.timestamp).toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatRoom({ room }: { room: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const sendMessageMutation = trpc.sendMessage.useMutation();
  
  trpc.chatMessages.useSubscription(
    { room },
    {
      onData: (message) => {
        setMessages(prev => [...prev, message]);
      },
    }
  );
  
  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate({
        room,
        user: 'CurrentUser',
        message: newMessage,
      });
      setNewMessage('');
    }
  };
  
  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### Key Concepts
- **Observables**: Stream of data over time
- **Event Emitters**: Server-side event broadcasting
- **Subscription Lifecycle**: Connect, data flow, cleanup
- **Real-time State**: Managing live data in UI

### Use Cases for Subscriptions
- **Live Data Feeds**: Stock prices, sports scores
- **Chat Applications**: Real-time messaging
- **Collaborative Editing**: Document changes
- **Gaming**: Player positions, game state
- **Monitoring**: System health, user activity

### Performance Considerations
- **Connection Limits**: WebSocket connection pooling
- **Memory Management**: Clean up subscriptions
- **Bandwidth**: Throttle high-frequency updates
- **Error Handling**: Reconnection strategies

### Production Setup
- Use dedicated WebSocket servers for scale
- Implement proper authentication for subscriptions
- Add rate limiting and abuse protection
- Monitor connection health and metrics

Test real-time features in the playground below! 