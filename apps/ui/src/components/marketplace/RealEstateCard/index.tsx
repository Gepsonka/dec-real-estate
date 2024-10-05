import React from "react";
import { RealEstateCardProps } from "./types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
} from "@nextui-org/react";
import { LucideIconWrapper } from "@/components/LucideIconWrapper/LucideIconWrapper";
import { Home } from "lucide-react";
import { Image } from "@nextui-org/react";

export const RealEstateCard = (props: RealEstateCardProps) => {
  const handleCardClick = () => {
    if (!props.onClick) return;
    console.log("Card clicked");
    props.onClick();
  };

  const renderImage = () => {
    if (props.imageUrl) {
      return <Image alt="Real Estate Index" width={300} src={props.imageUrl} />;
    } else {
      return (
        <LucideIconWrapper
          Icon={Home}
          color={{
            light: "#1e1e1e",
            dark: "#e4e4e4",
          }}
          size={150}
        />
      );
    }
  };

  const renderProgress = () => {
    if (props.tokensAvailable) {
      return (
        <CardFooter className="real-estate-card__footer">
          <Progress
            label={`${props.tokensAvailable} / ${props.tokenSupply} available `}
            color="primary"
            aria-label="supply-remaining"
            value={Math.round(
              (props.tokensAvailable / props.tokenSupply) * 100
            )}
            className="progress-bar"
          />
        </CardFooter>
      );
    }
  };

  return (
    <Card className="real-estate-card" onClick={handleCardClick}>
      <CardHeader className="real-estate-card__header">
        {renderImage()}
      </CardHeader>
      <CardBody className="real-estate-card__body">
        <h3 onClick={handleCardClick} className="card_title">
          {props.title}
        </h3>
        {props.pricePerToken && (
          <p>Price per token: {props.pricePerToken} ETH</p>
        )}
        <p>Creator: {props.creator}</p>
      </CardBody>
      {renderProgress()}
    </Card>
  );
};
