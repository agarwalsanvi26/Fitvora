package com.fitvora.interfaces;

import java.io.Serializable;

/**
 * Interface for entities that possess a unique identifier.
 * Demonstrates Java Interface abstraction and Generics.
 */
public interface Identifiable<ID extends Serializable> {
    ID getId();
    void setId(ID id);
}
