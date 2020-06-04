import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import { gql } from 'apollo-boost';
import { useSubscription, useMutation } from '@apollo/react-hooks';
import Message from '../components/Message';
import Compose from '../components/Compose';
import ApplicationStyles from '../styles/appstyles';
import { getMessagesById, postMessage } from '../services/api';
import background from '../../assets/background.png';

const GET_MESSAGES = gql`
  subscription($user_id: uuid!) {
    messages(where: {user_id: {_eq: $user_id}}) {
      message
      id
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($message: String!, $user_id: uuid!, $conversation_id: uuid!) {
    insert_messages(objects: {message: $message, user_id: $user_id, conversation_id: $conversation_id}) {
      returning {
        message
      }
    }
  }
`;

export default ({ route }) => {
  const { loading, data, error } = useSubscription(GET_MESSAGES, {
    variables: { user_id: route.params.userId }
  });
  const [addMessage, { dataMutation }] = useMutation(ADD_MESSAGE);

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

  if (loading || error) {
    return <View><Text>Test</Text></View>;
  }

  return (
    <ImageBackground
      source={background}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.container}>
        <FlatList
          style={styles.container}
          data={data.messages}
          renderItem={({ item }) => <Message key={item.id} {...item} />}
          keyExtractor={(item, index) => `message-${index}`}
        />
        <Compose userId={route.params.userId} conversationId={route.params.conversationId} submit={(text, userId, conversationId) => addMessage({ variables: { message: text, user_id: userId, conversation_id: conversationId } })} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  ...ApplicationStyles,
});