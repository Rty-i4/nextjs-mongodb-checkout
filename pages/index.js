import React, { useState } from "react";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";

import {
  Paper,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  SimpleGrid,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan("sm");

  return {
    wrapper: {
      display: "flex",
      maxWidth: 500,
      margin: "auto",

      borderRadius: theme.radius.lg,

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    paper: {
      background: `linear-gradient(135deg,#feb47b, #ff7e5f)`,
      margin: 20,
    },

    form: {
      boxSizing: "border-box",
      flex: 1,
      padding: theme.spacing.xl,
      paddingLeft: theme.spacing.xl * 2,

      borderLeft: 0,
      label: {
        color: "white",
      },

      [BREAKPOINT]: {
        padding: theme.spacing.md,
        paddingLeft: theme.spacing.md,
      },
    },

    fields: {
      marginTop: -12,
    },

    fieldInput: {
      flex: 1,

      "& + &": {
        marginLeft: theme.spacing.md,

        [BREAKPOINT]: {
          marginLeft: 0,
          marginTop: theme.spacing.md,
        },
      },
    },

    fieldsGroup: {
      display: "flex",

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    title: {
      marginBottom: theme.spacing.xl * 1.5,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      color: "white",
      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },

    control: {
      [BREAKPOINT]: {
        flex: 1,
      },
      backgroundPosition: "right bottom",
      background: `linear-gradient(to right, #228be6 50%, ${theme.fn.darken(
        "#00acee",
        0.5
      )} 50%) right`,
      transition: "0.3s ease-out",
      backgroundSize: "200% 100%",
      "&:hover": {
        backgroundPosition: "left bottom",
      },
      "&:disabled": {
        background: "grey",
      },
    },
  };
});

export default function Home() {
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { classes } = useStyles();
  const [errors, setErrors] = useState({});

  const handlePost = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length) {
      return console.log(errors);
    }

    let post = {
      cardNumber: cardNumber,
      expDate: expDate,
      cvv: cvv,
      amount: amount,
      createdAt: new Date().toISOString(),
    };

    let response = await fetch("/api/invoices", {
      method: "POST",
      body: JSON.stringify(post),
    });

    let data = await response.json();

    if (data.success) {
      console.log(data.body);
      return;
    } else {
      console.log(data.message);
      return setError(data.message);
    }
  };

  return (
    <div>
      <div className={classes.wrapper}>
        <Paper
          shadow="md"
          radius="lg"
          style={{ marginTop: 200 }}
          className={classes.paper}
        >
          <form className={classes.form} onSubmit={(e) => handlePost(e)}>
            <Text size="lg" weight={700} className={classes.title}>
              Payment method
            </Text>

            <div className={classes.fields}>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                <TextInput
                  label="Card Number"
                  placeholder="Card Number"
                  type="number"
                  value={cardNumber}
                  onChange={(e) => {
                    setErrors({});
                    if (e.currentTarget.value.length < 17) {
                      setCardNumber(e.currentTarget.value);
                    }
                  }}
                  error={errors.cardNumber}
                  required
                />
                <DatePicker
                  label="Expiration date"
                  placeholder="MM/YYYY"
                  inputFormat="MM/YYYY"
                  labelFormat="MM/YYYY"
                  onChange={(e) => {
                    setErrors({});

                    setExpDate(e === null ? null : dayjs(e).format("MM/YYYY"));
                  }}
                  value={expDate}
                  error={errors.expDate}
                  required
                />
              </SimpleGrid>

              <TextInput
                mt="md"
                label="CVV"
                placeholder="CVV"
                type="number"
                value={cvv}
                onChange={(e) => {
                  setErrors({});
                  if (e.currentTarget.value.length < 4) {
                    setCvv(e.currentTarget.value);
                  }
                }}
                error={errors.cvv}
                required
              />

              <TextInput
                mt="md"
                label="Amount"
                placeholder="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setErrors({});
                  setAmount(e.currentTarget.value);
                }}
                error={errors.amount}
                required
              />

              <Group position="right" mt="md">
                <Button
                  type="submit"
                  className={classes.control}
                  disabled={
                    cardNumber.length !== 16 ||
                    !expDate ||
                    cvv.length !== 3 ||
                    amount.length < 1
                  }
                >
                  Submit
                </Button>
              </Group>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
}
