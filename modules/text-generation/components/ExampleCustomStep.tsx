/**
 * Example Custom Step Component
 * 
 * Use this as a template for creating your own custom components.
 */

export interface ExampleCustomStepProps {
  title?: string;
  message?: string;
  onNext: () => void;
  onPrevious?: () => void;
  [key: string]: any;
}

export default function ExampleCustomStep({
  title = 'Custom Step',
  message = 'This is a custom component!',
  onNext,
  onPrevious,
}: ExampleCustomStepProps) {
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={onNext}>Continue</button>
        {onPrevious && <button onClick={onPrevious} style={{ marginLeft: '1rem' }}>Back</button>}
      </div>
    </div>
  );
}
