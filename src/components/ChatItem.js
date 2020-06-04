import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import Avatar from './Avatar';

export default ({ title, user, id: conversationId, content, navigate, messages_aggregate }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);
  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            }),
          },
        ],
      }}>
      <TouchableOpacity
        onPress={() => navigate('ChatViewScreen', { userId: user.id, title, conversationId })}
        style={styles.chatItem}>
        <Avatar src={user.avatarUrl} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.label}>{content}</Text>
        </View>
        <View style={styles.navLabel}>
          {messages_aggregate.aggregate.max.timestamp && <Text style={styles.label}>{dayjs(messages_aggregate.aggregate.max.timestamp).format('DD/MM')}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 24,
    marginLeft: 24,
  },
  content: {
    flex: 5,
  },
  navLabel: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  title: {
    fontWeight: 'bold',
  },
  label: {
    color: 'rgba(0,0,0,.5)',
  },
  arrow: {
    color: 'rgba(0,0,0,.5)',
  },
});
