import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashPasswordForAdmin {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "123123123";
        String hashedPassword = encoder.encode(password);
        System.out.println("Password '" + password + "' hashed: " + hashedPassword);
    }
}



