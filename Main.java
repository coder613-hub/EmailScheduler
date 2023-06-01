import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        // creates three different Connection objects
        Connection conn1 = null;
        Connection conn2 = null;
        Connection conn3 = null;

        try {
            // connect way #1
            //String url1 = "jdbc:mysql://emailscheduleinfo.cvt99kij6zpm.us-east-1.rds.amazonaws.com:3306/EmailDBSchema";
            String url1 = "jdbc:mysql://database-1.czqltbydhoi5.us-east-1.rds.amazonaws.com/thisismyschemaforemails";
            String user = "admin";
            String password = "Practicum123";

            conn1 = DriverManager.getConnection(url1, user, password);
            //String senderID;
            System.out.println("What is your sender email?");
            Scanner keyboard = new Scanner(System.in);
            String sender = keyboard.nextLine();
            if (conn1 != null) {
               // System.out.println("Connected to the database test1");
                String query = "select Recipient, Subject, Body, TimeOfDay, Recurring, NumberDay " +
                        "from EmailDetails where Sender = ? ";

                //

               // try (Statement stmt = conn1.createStatement()) {
                try (PreparedStatement stmt = conn1.prepareStatement(query)) {
                    stmt.setString(1, sender);
                    ResultSet rs = stmt.executeQuery();
                    while (rs.next())
                    {
                        String Recipient = rs.getString("Recipient");
                        String Subject = rs.getString("Subject");
                        String Body = rs.getString("Body");
                        String TimeOfDay = rs.getString("TimeOfDay");
                        String Recurring = rs.getString("Recurring");
                        String NumberDay = rs.getString("NumberDay");


                        SimpleDateFormat formatter1 = new SimpleDateFormat("YYYY-MM-DD HH:mm:ss");
                        Date date1= formatter1.parse(TimeOfDay);

                        System.out.println("Recipient: " + Recipient + "\nSubject: " + Subject + "\nBody: " + Body

                                );

                        if (Recurring.equals("1")){

                            System.out.println("Recurring every month on day " + NumberDay + " at " + date1.getHours() + ":" +date1.getMinutes());

                        } else if (Recurring.equals("2")) {

                             switch(NumberDay)
                            {
                                case "1":
                                    NumberDay = "Sunday";
                                case "2":
                                    NumberDay = "Monday";
                                case "3":
                                    NumberDay = "Tuesday";
                                case "4":
                                    NumberDay = "Wednesday";
                                case "5":
                                    NumberDay = "Thursday";
                                case "6":
                                    NumberDay = "Friday";
                                case "7":
                                    NumberDay = "Saturday";
                            }
                            System.out.println("Recurring every week on " + NumberDay + " at "+ date1.getHours() + ":" +date1.getMinutes());

                        }
                        else
                        {
                            System.out.println("Recurring every day at  "+ date1.getHours()+ ":" +date1.getMinutes());


                        }
                        System.out.println( "\n\n");
                    }


                } catch (SQLException e) {
                    //JDBCTutorialUtilities.printSQLException(e);
                    System.out.println(e.getMessage());
                } catch (ParseException e) {
                    throw new RuntimeException(e);
                }
            }
            

        } catch (SQLException ex) {
            System.out.println("An error occurred. Maybe user/password is invalid");
            ex.printStackTrace();
        }



    }
}