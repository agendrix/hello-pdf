import Consumer from "./Consumer";

const healthCheck = async () => {
  const consumerIsHealthy = await Consumer.isHealthy();
  consumerIsHealthy ? process.exit(0) : process.exit(1);
};

healthCheck();
