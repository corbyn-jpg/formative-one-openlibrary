import React from 'react';

// Loading skeleton for charts
export const ChartSkeleton = ({ height = '55vh', width = '100%' }) => (
  <div
    style={{
      backgroundColor: 'rgba(81, 53, 44, 0.8)',
      height,
      width,
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        height: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '20px',
        width: '60%'
      }}
      className="shimmer"
    />
    <div
      style={{
        height: 'calc(100% - 60px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '20px',
        gap: '10px'
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.random() * 60 + 40}%`,
            backgroundColor: 'rgba(144, 160, 255, 0.3)',
            borderRadius: '4px'
          }}
          className="shimmer"
        />
      ))}
    </div>
  </div>
);

// Loading skeleton for cards
export const CardSkeleton = () => (
  <div
    style={{
      width: '250px',
      height: '350px',
      backgroundColor: 'rgba(81, 53, 44, 0.8)',
      borderRadius: '8px',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}
  >
    <div
      style={{
        height: '200px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px'
      }}
      className="shimmer"
    />
    <div
      style={{
        height: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        width: '80%'
      }}
      className="shimmer"
    />
    <div
      style={{
        height: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        width: '60%'
      }}
      className="shimmer"
    />
  </div>
);

// Loading skeleton for carousel
export const CarouselSkeleton = () => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '20vw',
          height: '50vh',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}
        className="shimmer"
      />
    </div>
    <div
      style={{
        height: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginTop: '15px',
        width: '200px',
        margin: '15px auto 0'
      }}
      className="shimmer"
    />
  </div>
);

// Generic loading spinner
export const LoadingSpinner = ({ size = '40px', color = 'white' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}
  >
    <div
      style={{
        width: size,
        height: size,
        border: `4px solid rgba(255, 255, 255, 0.1)`,
        borderTop: `4px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  </div>
);

// Enhanced loading states with context
export const LoadingState = ({ 
  type = 'spinner', 
  message = 'Loading...', 
  height = '200px',
  showMessage = true 
}) => {
  const renderContent = () => {
    switch (type) {
      case 'chart':
        return <ChartSkeleton height={height} />;
      case 'cards':
        return (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        );
      case 'carousel':
        return <CarouselSkeleton />;
      default:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height,
              color: 'white'
            }}
          >
            <LoadingSpinner />
            {showMessage && (
              <p style={{ marginTop: '20px', fontSize: '18px' }}>{message}</p>
            )}
          </div>
        );
    }
  };

  return renderContent();
};