import { Button, Html } from "@react-email/components";

export function Email(props: { url: string }) {
  const { url } = props;

  return (
    <Html lang="pt-BR">
      <Button href={url}>Clique Aqui</Button>
    </Html>
  );
}

export default Email;
