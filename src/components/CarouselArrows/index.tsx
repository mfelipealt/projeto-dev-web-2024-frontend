import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function SampleNextArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div className={className} style={{ ...style, display: "block", background: "transparent" }} onClick={onClick}>
      <ArrowForwardIcon style={{ color: "black", fontSize: "30px" }} />
    </div>
  );
}

export function SamplePrevArrow({ className, style, onClick }: ArrowProps) {
  return (
    <div className={className} style={{ ...style, display: "block", background: "transparent" }} onClick={onClick}>
      <ArrowBackIcon style={{ color: "black", fontSize: "30px" }} />
    </div>
  );
}